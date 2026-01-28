import { ConfigBase } from 'commons';

export default class Config extends ConfigBase {
  static PORT: number = parseInt(`${process.env.PORT || 3001}`);

  static CHAIN_ID: number = parseInt(`${process.env.CHAIN_ID || 5}`);

  static AUTH_MSG: string = `${process.env.AUTH_MSG || 'Authenticating to Cerberus. Timestamp: <timestamp>'}`;
}
