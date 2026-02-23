import nodemailer, { Transporter } from "nodemailer";
import Config from "../config";

let transporter: Transporter;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: Config.MAIL_HOST,
      port: Config.MAIL_PORT,
      secure: Config.MAIL_SECURE,
      auth: {
        user: Config.MAIL_USER,
        pass: Config.MAIL_PASSWORD,
      },
    });
  }

  return transporter;
}

export async function sendMail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  await getTransporter().sendMail({
    from: Config.DEFAULT_FROM,
    to,
    subject,
    text,
  });

  console.log(`[Engine][Mail] Sent to ${to}`);
}
