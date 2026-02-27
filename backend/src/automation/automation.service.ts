import { Injectable } from '@nestjs/common';
import { AutomationDTO } from './automation.dto';
import { Automation } from 'commons';
import db from '../db';

@Injectable()
export class AutomationService {
  async getAutomation(id: string, userId: string): Promise<Automation | null> {
    return db.automations.findFirst({
      where: { id, userId },
    });
  }

  async getAutomations(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Automation[]> {
    return db.automations.findMany({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async getActiveAutomations(userId: string): Promise<Automation[]> {
    return db.automations.findMany({
      where: { userId, isActive: true },
    });
  }

  async addAutomation(
    userId: string,
    automation: AutomationDTO,
  ): Promise<Automation> {
    return db.automations.create({
      data: {
        exchange: automation.exchange,
        network: automation.network,
        openCondition: automation.openCondition,
        closeCondition: automation.closeCondition!, 
        isActive: automation.isActive || false,
        isOpened: automation.isOpened || false,
        name: automation.name,
        nextAmount: automation.nextAmount,
        poolId: automation.poolId,
        userId,
      },
    });
  }

  async updateAutomation(
    id: string,
    userId: string,
    automation: AutomationDTO,
  ): Promise<Automation> {
    return db.automations.update({
      where: { userId, id },
      data: {
        exchange: automation.exchange,
        network: automation.network,
        openCondition: automation.openCondition,
        closeCondition: automation.closeCondition ?? undefined,
        isActive: automation.isActive || false,
        isOpened: automation.isOpened || false,
        name: automation.name,
        nextAmount: automation.nextAmount,
        poolId: automation.poolId,
      },
    });
  }

  async startAutomation(id: string, userId: string): Promise<Automation> {
    return db.automations.update({
      where: { userId, id },
      data: {
        isActive: true,
      },
    });
  }

  async stopAutomation(id: string, userId: string): Promise<Automation> {
    return db.automations.update({
      where: { userId, id },
      data: {
        isActive: false,
      },
    });
  }

  async deleteAutomation(id: string, userId: string): Promise<Automation> {
    return db.automations.delete({
      where: { userId, id },
    });
  }
}
