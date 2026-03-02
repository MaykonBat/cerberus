import Config from "./config";
import { getTopPools } from "commons/services/uniswapService";
import poolsRepository from "./repositories/poolsRepository";
import WSSInit from "./wss";
import cerberusExecution from "./cerberus";

const WSS = WSSInit();

async function executionCycle() {
  const pages = Math.ceil(Config.POOL_COUNT / 1000);

  for (let i = 0; i < pages; i++) {
    const pools = await getTopPools(1000, i * 1000);
    console.log(`Loaded ${pools.length} pools...`);

    const bulkResult = [];
    for (let j = 0; j < pools.length; j++) {
      const pool = pools[j];
      const poolResult = await poolsRepository.updatePrices(pool);
      if (!poolResult) continue;

      bulkResult.push(poolResult);

      cerberusExecution(poolResult, WSS);

      //console.log(`Price for ${poolResult.symbol} (${poolResult.fee / 10000}%) is ${Number(poolResult.price0).toFixed(3)}`);
    }

    WSS.broadcast({ event: "priceUpdate", data: bulkResult });
  }
}

export default () => {
  setInterval(executionCycle, Config.MONITOR_INTERVAL);

  executionCycle();

  console.log(`Cerberus Monitor started.`);
};
