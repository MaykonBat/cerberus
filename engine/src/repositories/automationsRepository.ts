import { Automation, ChainId, Exchange } from "commons";
import connect from "./db";

async function getAutomation(
  id: string,
  userId: string,
): Promise<Automation | null> {
  const db = await connect();
  return db.automations.findUnique({
    where: { id, userId },
  });
}

async function getAutomations(
  userId: string,
  network: ChainId,
  exchange: Exchange,
): Promise<Automation[]> {
  const db = await connect();
  return db.automations.findMany({
    where: { userId, network, exchange },
  });
}

async function searchAutomations(poolId: string): Promise<Automation[]> {
  const db = await connect();
  return db.automations.findMany({
    where: {
      OR: [
        {
          poolId,
        },
        {
          poolId: null,
        },
      ],
      isActive: true,
    },
  });
}

async function addAutomation(automation: Automation): Promise<Automation> {
  if (!automation.userId) throw new Error(`Invalid automation userId.`);
  const db = await connect();
  return db.automations.create({
    data: new Automation(automation),
  });
}

async function startAutomations(userId: string): Promise<void> {
  const db = await connect();
  await db.automations.updateMany({
    where: { userId },
    data: { isActive: true },
  });
}

async function stopAutomations(userId: string): Promise<void> {
  const db = await connect();
  await db.automations.updateMany({
    where: { userId },
    data: { isActive: false },
  });
}

async function updateAutomation(
  automationData: Automation,
): Promise<Automation | null> {
  if (!automationData.userId || !automationData.id)
    throw new Error(`Invalid automation userId and/or id.`);
  const db = await connect();
  await db.automations.update({
    where: { userId: automationData.userId, id: automationData.id },
    data: {
      name: automationData.name,
      poolId: automationData.poolId,
      nextAmount: automationData.nextAmount,
      exchange: automationData.exchange,
      network: automationData.network,
      isActive: automationData.isActive,
      isOpened: automationData.isOpened,
      openCondition: automationData.openCondition,
      closeCondition: automationData.closeCondition,
    },
  });

  return getAutomation(automationData.id, automationData.userId);
}

async function deleteAutomation(id: string, userId: string): Promise<boolean> {
  const db = await connect();

  await db.automations.delete({
    where: { id, userId },
  });

  return true;
}

export default {
  getAutomation,
  getAutomations,
  addAutomation,
  deleteAutomation,
  updateAutomation,
  searchAutomations,
  startAutomations,
  stopAutomations,
};
