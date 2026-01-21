import Config from "./config";
import { getTopPools } from "./services/uniswapService";
import poolsRepository from "./repositories/poolsRepository";
import WSSInit from "./wss";

const WSS = WSSInit();

async function executionCycle() {
  const pages = Math.ceil(Config.POOL_COUNT / 1000);

  for (let i = 0; i < pages; i++) {
    const pools = await getTopPools(1000, i * 1000);
    console.log(`Loaded ${pools.length} pools...`);

    const bulkResult = [];
    for (let j = 0; j < pools.length; j++) {
      const pool = pools[j];
      const result = await poolsRepository.updatePrices(pool);
      if (!result) continue;

      bulkResult.push(result);

      console.log(`Price for ${result.symbol} (${result.fee / 10000}%) is ${Number(result.price0).toFixed(3)}`);
    }

    WSS.broadcast({ event: "priceUpdate", data: bulkResult });
  }
}

setInterval(executionCycle, Config.MONITOR_INTERVAL);

executionCycle();

console.log(`Cerberus Monitor started.`);
