import { ChainId } from "commons/models/chainId";
import connect from "./db";
import Pool from "commons/models/pool";
import { Exchange } from "commons/models/exchange";
import { PoolData } from "../services/uniswapTypes";
import Config from "../config";

async function countPools(
  exchange: Exchange,
  network: ChainId,
): Promise<number> {
  const db = await connect();

  const count = await db.pools.count({
    where: { network, exchange },
  });

  return count;
}

async function getPool(id: string): Promise<Pool | null> {
  const db = await connect();

  const pool = await db.pools.findUnique({
    where: { id },
  });

  return pool;
}

async function addPool(pool: Pool): Promise<Pool> {
  const db = await connect();

  const newPool = await db.pools.create({
    data: pool,
  });

  return newPool;
}

function buildSet(
  newPrice: number,
  pool: any,
  tokenNumber: string,
  minutes: number,
) {
  const setObj: any = {};
  const xMinutesAgo = new Date(new Date().getTime() - minutes * 60 * 1000);
  if (pool[`lastUpdate_${minutes}`] <= xMinutesAgo) {
    const oldPriceX = Number(pool[`price${tokenNumber}_${minutes}`]);
    const priceChangeX = ((newPrice - oldPriceX) / oldPriceX) * 100;

    setObj[`price${tokenNumber}_${minutes}`] = `${newPrice}`;
    setObj[`price${tokenNumber}Change_${minutes}`] =
      priceChangeX && Number.isFinite(priceChangeX) ? priceChangeX : 0;
    setObj[`lastUpdate_${minutes}`] = new Date();
  }

  return setObj;
}

function buildSetFull(pool: Pool, newPrice: number, tokenNumber: string) {
  if (!["0", "1"].includes(tokenNumber))
    throw new Error(`Token Number must be 0 or 1.`);

  const oldPrice = Number(tokenNumber === "0" ? pool.price0 : pool.price1);
  const priceChange = ((newPrice - oldPrice) / oldPrice) * 100;

  const setObj: any = {};
  setObj[`price${tokenNumber}`] = `${newPrice}`;
  setObj[`price${tokenNumber}Change`] =
    priceChange && Number.isFinite(priceChange) ? priceChange : 0;
  setObj[`lastUpdate`] = new Date();

  const setObj_15 = buildSet(newPrice, pool, tokenNumber, 15);
  const setObj_60 = buildSet(newPrice, pool, tokenNumber, 60);

  return { ...setObj, ...setObj_15, ...setObj_60 };
}

async function updatePrices(poolData: PoolData): Promise<Pool | null> {
  let pool = await getPool(poolData.id);
  if (!pool) {
    pool = new Pool({
      exchange: Config.EXCHANGE2,
      network: Config.NETWORK2,
      id: poolData.id,
      fee: Number(poolData.feeTier),
      token0: poolData.token0.id,
      token1: poolData.token1.id,
      symbol: poolData.token0.symbol + poolData.token1.symbol,
      symbol0: poolData.token0.symbol,
      symbol1: poolData.token1.symbol,
    } as Pool);
    pool = await addPool(pool);
  }

  const newPrice0 = Number(poolData.token0Price);
  const newPrice1 = Number(poolData.token1Price);

  const setObj0 = buildSetFull(pool, newPrice0, "0");
  const setObj1 = buildSetFull(pool, newPrice1, "1");

  const db = await connect();

  await db.pools.update({
    where: { id: poolData.id },
    data: { ...setObj0, ...setObj1 },
  });

  return getPool(poolData.id);
}

export default {
  getPool,
  addPool,
  countPools,
  updatePrices,
};
