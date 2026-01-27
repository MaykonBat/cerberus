export default class ConfigService {
  static AUTH_MSG: string = `${process.env.AUTH_MSG || "Authenticating to Cerberus. Timestamp: <timestamp>"}`;

  static getAuthMsg(): string {
    if (ConfigService.AUTH_MSG.indexOf("<timestamp>") === -1)
      throw new Error(`The auth message must have a <timestamp> placeholder.`);
    return ConfigService.AUTH_MSG.replace("<timestamp>", Date.now().toString());
  }

  static CERBERUS_PAY_CONTRACT: string = `${process.env.CERBERUS_PAY_CONTRACT}`;
}