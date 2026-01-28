import { ConfigBase } from "commons";
import { Exchange } from "commons";
import { ChainId } from "commons";

export default class Config extends ConfigBase {
  static MONITOR_INTERVAL: number = parseInt(`${process.env.MONITOR_INTERVAL}`);

  static NETWORK: string = `${process.env.NETWORK}`;

  static getNetwork(network: string): ChainId {
    switch (network) {
      case "SEPOLIA":
        return ChainId.SEPOLIA;
      case "BNB":
        return ChainId.BNB;
      default:
        return ChainId.MAINNET;
    }
  }

  static NETWORK2: ChainId = Config.getNetwork(Config.NETWORK);

  static EXCHANGE: string = `${process.env.EXCHANGE}`;

  static getExchange(exchange: string): Exchange {
    switch (exchange) {
      case "PancakeSwap":
        return Exchange.PancakeSwap;
      default:
        return Exchange.Uniswap;
    }
  }

  static EXCHANGE2: Exchange = Config.getExchange(Config.EXCHANGE);

  static UNISWAP_GRAPH_URL: string = `${process.env.UNISWAP_GRAPH_URL}`;

  static POOL_COUNT: number = parseInt(`${process.env.POOL_COUNT}`);

  static WS_PORT: number = parseInt(`${process.env.WS_PORT}`);
}
