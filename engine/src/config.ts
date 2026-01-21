import { Exchange } from "../../_commons_/models/exchange";
import { ChainId } from "../../_commons_/models/chainId";


import dotenv from "dotenv";
dotenv.config();

const MONITOR_INTERVAL: number = parseInt(`${process.env.MONITOR_INTERVAL}`);

const NETWORK: string = `${process.env.NETWORK}`;

function getNetwork(network: string): ChainId {
  switch (network) {
    case "SEPOLIA":
      return ChainId.SEPOLIA;
    case "BNB":
      return ChainId.BNB;
    default:
      return ChainId.MAINNET;
  }
}

const NETWORK2: ChainId = getNetwork(NETWORK);

const EXCHANGE: string = `${process.env.EXCHANGE}`;

function getExchange(exchange: string): Exchange {
  switch (exchange) {
    case "PancakeSwap":
      return Exchange.PancakeSwap;
    default:
      return Exchange.Uniswap;
  }
}

const EXCHANGE2: Exchange = getExchange(EXCHANGE);

const DATABASE_URL: string = `${process.env.DATABASE_URL}`;

const UNISWAP_GRAPH_URL: string = `${process.env.UNISWAP_GRAPH_URL}`;

const POOL_COUNT: number = parseInt(`${process.env.POOL_COUNT}`);

const WS_PORT: number = parseInt(`${process.env.WS_PORT}`);

export default {
  MONITOR_INTERVAL,
  NETWORK,
  NETWORK2,
  EXCHANGE,
  EXCHANGE2,
  DATABASE_URL,
  UNISWAP_GRAPH_URL,
  POOL_COUNT,
  WS_PORT
};
