import { Automation, Pool } from "commons";
import automationsRepository from "./repositories/automationsRepository";
import usersRepository from "./repositories/usersRepository";
import { swap } from "commons/services/uniswapService";
import { sendMail } from "./services/mailService";

function evalCondition(automation: Automation, pool: Pool): boolean {
  const condition = automation.isOpened
    ? automation.closeCondition
    : automation.openCondition;
  if (!condition) return false;

  const ifCondition = `pool.${condition.field}${condition.operator}${condition.value}`;
  console.log("Condition: " + ifCondition);

  const result = Function("pool", "return " + ifCondition)(pool);
  console.log("[ENGINE] Condition Result: " + result);
  return result;
}

export default async (pool: Pool): Promise<void> => {
  const automations = await automationsRepository.searchAutomations(pool.id);
  if (!automations || !automations.length) return;

  console.log(`[ENGINE] ${automations.length} automations found.`);

  automations.map(async (automation) => {
    const isValid = evalCondition(automation, pool);
    if (!isValid) return;

    console.log(`[ENGINE] ${automation.name} fired!`);

    const user = await usersRepository.getUserById(automation.userId);
    if (!user || !user.privateKey) return;

    console.log(`[ENGINE] ${user.email} will swap`);

    try {
      const amountOut = await swap(user, automation, pool);
      if (amountOut !== "0") automation.nextAmount = amountOut;

      automation.isOpened = !automation.isOpened;

      // registrar o trade
    } catch (err: any) {
      console.error(`[ENGINE] Cannot swap. AutomationId: ${automation.id}. Message: ${err.message}`);
      automation.isActive = false;

      await sendMail(
        user.email,
        "Cerberus - Automation Error",
        `
            Hi, ${user.name}!
        
            Your automation was stopped due to a swap error. Tx Id: 

            ${err.message}
        
            See you!
            Cerberus Team
        `,
      );
    }

    await automationsRepository.updateAutomation(automation);
  });
};
