import { ConfigBase } from 'commons';

export default class Config extends ConfigBase {
  static PORT: number = parseInt(`${process.env.PORT || 3001}`);

  static CHAIN_ID: number = parseInt(`${process.env.CHAIN_ID || 5}`);

  static AUTH_MSG: string = `${process.env.AUTH_MSG || 'Authenticating to Cerberus. Timestamp: <timestamp>'}`;

  // mail
  static MAILER_TRANSPORT = {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT || 587),
    secure: false, // ⚠️ 587 = false
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  };

  static DEFAULT_FROM = `"Cerberus" <${process.env.MAIL_USER}>`;
}
