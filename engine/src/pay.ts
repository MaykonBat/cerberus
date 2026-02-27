import {
  getCustomerNextPayment,
  getCustomers,
  pay,
} from "commons/services/cerberusPayService";
import Config from "./config";
import usersRepository from "./repositories/usersRepository";
import { Status } from "commons";
import { sendMail } from "./services/mailService";
import automationsRepository from "./repositories/automationsRepository";

async function executionCycle() {
  console.log("Executing the payment cycle...");

  let customers: string[] = [];

  try {
    customers = await getCustomers();
  } catch (err) {
    console.error("[ENGINE] Failed to load customers:", err);
    return;
  }

  console.log(`[ENGINE] ${customers.length} customers loaded`);

  for (let i = 0; i < customers.length; i++) {
    const customerAddress = customers[i].toLowerCase();
    if (/^(0x0+)$/.test(customerAddress)) continue;

    let user;

    try {
      const nextPayment = await getCustomerNextPayment(customerAddress);
      if (nextPayment > Math.floor(Date.now() / 1000)) continue;

      console.log("[ENGINE] Charging customer " + customerAddress);

      await pay(customerAddress);
      user = await usersRepository.updateUserStatus(customerAddress, Status.ACTIVE);
      if(!user) continue;

      await automationsRepository.startAutomations(user.id!);

      console.log(`[ENGINE] Payment OK for ${customerAddress}`);
    } catch (err: any) {
      console.error(
        `[ENGINE] Payment failed for ${customerAddress}:`,
        err?.shortMessage || err?.message || err,
      );

      user = await usersRepository.updateUserStatus(
        customerAddress,
        Status.BLOCKED,
      );

      if (!user) continue;

      await automationsRepository.stopAutomations(user.id!);

      try {
        await sendMail(
          user.email,
          "Cerberus - Account Blocked",
          `
            Hi, ${user.name}!

            We couldn't process your recurring payment due to insufficient balance or allowance.

            Please update your payment authorization using the link below:
            ${Config.SITE_URL}/pay/${user.address}

            After that, your automations will be re-enabled automatically.

            See you!
            Cerberus Team
          `,
        );
      } catch (mailErr) {
        console.error(
          `[ENGINE] Failed to send email to ${user.email}:`,
          mailErr,
        );
      }
    }
  }

  console.log("[ENGINE] Payment cycle finished");
}

export default () => {
  setInterval(executionCycle, Config.CHARGE_INTERVAL);

  executionCycle();

  console.log("Cerberus Pay started.");
};
