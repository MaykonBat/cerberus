import * as dotenv from "dotenv";
dotenv.config();

export default class ConfigBase {
  //system
  static NODE_ENV: string = `${process.env.NODE_ENV || "development"}`;
  static DEV_ENV: boolean = ConfigBase.NODE_ENV === "development";
  static SITE_URL: string = `${process.env.SITE_URL || "http://localhost:3000"}`;
  //static MAILER_TRANSPORT: string = `${process.env.MAILER_TRANSPORT}`; movido para o backend

  /*
  static getDefaultFrom(transport: string) : string {
    if(!transport) return "";
    const spl = transport.split("//");
    return spl[spl.length - 1].split(":")[0];
  }

  static DEFAULT_FROM: string = ConfigBase.getDefaultFrom(ConfigBase.MAILER_TRANSPORT);
  */ //movido tudo pro backend

  //database
  static DATABASE_URL: string = `${process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/cerberus"}`;

  //blockchain
  static CERBERUS_PAY_CONTRACT: string = `${process.env.CERBERUS_PAY_CONTRACT}`;

  static RPC_NODE: string = `${process.env.RPC_NODE || "http://127.0.0.1:8545"}`;

  static ADMIN_PRIVATE_KEY: string = `${process.env.ADMIN_PRIVATE_KEY}`;

  //security
  static CORS_ORIGIN: string = `${process.env.CORS_ORIGIN || "*"}`;
  static JWT_SECRET: string = `${process.env.INFURA_SECRET}`;
  static JWT_EXPIRES: number = parseInt(`${process.env.JWT_EXPIRES}`);
  static AES_KEY: string = `${process.env.AES_KEY}`;

  static UNISWAP_GRAPH_URL: string = `${process.env.UNISWAP_GRAPH_URL}`;
  static UNISWAP_ROUTER: string = `${process.env.UNISWAP_ROUTER}`;
}
