import { Automation, Pool } from "commons";
import automationsRepository from "./repositories/automationsRepository";
import usersRepository from "./repositories/usersRepository";
import { swap } from "commons/services/uniswapService";
import { sendMail } from "./services/mailService";
import tradesRepository from "./repositories/tradesRepository";

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

  //automations.map(async (automation) =>

  for (const automation of automations) {
    const isValid = evalCondition(automation, pool);
    if (!isValid) continue;

    console.log(`[ENGINE] ${automation.name} fired!`);

    const user = await usersRepository.getUserById(automation.userId);
    if (!user || !user.privateKey) continue;

    console.log(`[ENGINE] ${user.email} will swap`);

    try {
      const swapResult = await swap(user, automation, pool);
      if (!swapResult) continue;

      if (swapResult.amountOut) automation.nextAmount = swapResult.amountOut;

      let trade;
      if (automation.isOpened) {
        trade = await tradesRepository.closeTrade(
          automation.userId,
          automation.id!,
          swapResult,
        );
        automation.tradeCount = automation.tradeCount
          ? automation.tradeCount + 1
          : 1;
        automation.pnl = automation.pnl
          ? automation.pnl + trade?.pnl!
          : trade?.pnl;
      } else
        trade = await tradesRepository.addTrade({
          automationId: automation.id!,
          userId: automation.userId,
          openAmountIn: swapResult.amountIn,
          openAmountOut: swapResult.amountOut,
          openPrice: swapResult.price,
        });

      automation.isOpened = !automation.isOpened;
    } catch (err: any) {
      console.error(
        `[ENGINE] Cannot swap. AutomationId: ${automation.id}. Message: ${err.message}`,
      );

      if (err.code !== "NONCE_EXPIRED") automation.isActive = false;

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
  }
};
