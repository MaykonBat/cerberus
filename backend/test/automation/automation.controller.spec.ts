import { Test, TestingModule } from "@nestjs/testing";
import { newAutomationMock, automationServiceMock, activeAutomationMock, inactiveAutomationMock } from "./automation.service.mock";
import { authServiceMock } from "../auth/auth.service.mock";
import { AutomationController } from "../../src/automation/automation.controller";
import { poolServiceMock } from "../pool/pool.service.mock";
import { activeUserMock, userServiceMock } from "../user/user.service.mock";
import { AutomationDTO } from "../../src/automation/automation.dto";

jest.mock("commons/services/uniswapService");

describe("AutomationController Tests", () => {

    const authorization = "authorization";
    let automationController: AutomationController;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [AutomationController],
            providers: [automationServiceMock, poolServiceMock, userServiceMock, authServiceMock]
        }).compile();

        automationController = moduleFixture.get<AutomationController>(AutomationController);
    })

    it("Should be defined", () => {
        expect(automationController).toBeDefined();
    })

    it("Should get automation", async () => {
        const automation = await automationController.getAutomation(newAutomationMock.id!, authorization);
        expect(automation).toBeDefined();
        expect(automation!.id).toEqual(newAutomationMock.id);
    })

    it("Should get automations", async () => {
        const automations = await automationController.getAutomations(authorization);
        expect(automations).toBeDefined();
        expect(automations.length).toBeTruthy();
    })

    it("Should get active automations", async () => {
        const automations = await automationController.getActiveAutomations(authorization);
        expect(automations).toBeDefined();
        expect(automations.length).toBeTruthy();
    })

    it("Should get top automations", async () => {
        const automations = await automationController.getTopAutomations(authorization);
        expect(automations).toBeDefined();
        expect(automations.length).toBeTruthy();
    })

    it('Should add automation', async () => {
        const automationData = { ...activeAutomationMock } as AutomationDTO;
        const result = await automationController.addAutomation(automationData, authorization);
        expect(result.id).toBeTruthy();
    });

    it('Should add automation (opened)', async () => {
        const automationData = { ...activeAutomationMock, isOpened: true, closeCondition: undefined } as AutomationDTO;
        const result = await automationController.addAutomation(automationData, authorization);
        expect(result.id).toBeTruthy();
    });

    it('Should add automation (price1)', async () => {
        const automationData = {
            ...activeAutomationMock,
            openCondition: { field: "price1", operator: "==", value: "0" }
        } as AutomationDTO;
        const result = await automationController.addAutomation(automationData, authorization);
        expect(result.id).toBeTruthy();
    });

    it('Should NOT add automation (private key)', async () => {
        userServiceMock.useValue.getUser = jest.fn().mockResolvedValue({ ...activeUserMock, privateKey: null })
        const automationData = { ...activeAutomationMock } as AutomationDTO;
        await expect(automationController.addAutomation(automationData, authorization))
            .rejects
            .toEqual(new Error(`You must have a private key in settings before add an automation.`));
        userServiceMock.useValue.getUser = jest.fn().mockResolvedValue(activeUserMock);
    });

    it('Should update automation', async () => {
        const automationData = { ...activeAutomationMock } as AutomationDTO;
        const result = await automationController.updateAutomation(activeAutomationMock.id!, automationData, authorization);
        expect(result.id).toEqual(activeAutomationMock.id);
    });

    it('Should update automation (inactive)', async () => {
        const automationData = { ...inactiveAutomationMock } as AutomationDTO;
        const result = await automationController.updateAutomation(inactiveAutomationMock.id!, automationData, authorization);
        expect(result.id).toEqual(inactiveAutomationMock.id);
    });

    it('Should update automation (opened)', async () => {
        const automationData = { ...activeAutomationMock, closeCondition: undefined, isOpened: true } as AutomationDTO;
        const result = await automationController.updateAutomation(inactiveAutomationMock.id!, automationData, authorization);
        expect(result.id).toEqual(inactiveAutomationMock.id);
    });

    it('Should update automation (price1)', async () => {
        const automationData = {
            ...activeAutomationMock,
            openCondition: {
                field: "price1",
                operator: "==",
                value: "0"
            }
        } as AutomationDTO;
        const result = await automationController.updateAutomation(inactiveAutomationMock.id!, automationData, authorization);
        expect(result.id).toEqual(inactiveAutomationMock.id);
    });

    it('Should update automation (no poolId)', async () => {
        const automationData = { ...activeAutomationMock, poolId: "" } as AutomationDTO;
        automationServiceMock.useValue.updateAutomation = jest.fn().mockResolvedValue(automationData);
        const result = await automationController.updateAutomation(activeAutomationMock.id!, automationData, authorization);
        expect(result.poolId).toBeFalsy();
        automationServiceMock.useValue.updateAutomation = jest.fn().mockResolvedValue(activeAutomationMock);
    });

    it('Should NOT update automation (private key)', async () => {
        userServiceMock.useValue.getUser = jest.fn().mockResolvedValue({ ...activeUserMock, privateKey: null })
        const automationData = { ...activeAutomationMock } as AutomationDTO;
        await expect(automationController.updateAutomation(activeAutomationMock.id!, automationData, authorization))
            .rejects
            .toEqual(new Error(`You must have a private key in settings before update an automation.`));
        userServiceMock.useValue.getUser = jest.fn().mockResolvedValue(activeUserMock);
    });

    it('Should delete automation', async () => {
        const result = await automationController.deleteAutomation(activeAutomationMock.id!, authorization);
        expect(result.id).toEqual(activeAutomationMock.id);
    });

    it('Should start automation', async () => {
        const result = await automationController.startAutomation(inactiveAutomationMock.id!, authorization);
        expect(result.isActive).toBeTruthy();
    });

    it('Should start automation (no poolId)', async () => {
        automationServiceMock.useValue.startAutomation = jest.fn().mockResolvedValue({ ...activeAutomationMock, poolId: "" });
        const result = await automationController.startAutomation(inactiveAutomationMock.id!, authorization);
        expect(result.isActive).toBeTruthy();
        automationServiceMock.useValue.startAutomation = jest.fn().mockResolvedValue(activeAutomationMock);
    });

    it('Should start automation (isOpened)', async () => {
        automationServiceMock.useValue.startAutomation = jest.fn().mockResolvedValue({ ...activeAutomationMock, isOpened: true, closeCondition: undefined });
        const result = await automationController.startAutomation(inactiveAutomationMock.id!, authorization);
        expect(result.isActive).toBeTruthy();
        automationServiceMock.useValue.startAutomation = jest.fn().mockResolvedValue(activeAutomationMock);
    });

    it('Should start automation (price1)', async () => {
        automationServiceMock.useValue.startAutomation = jest.fn().mockResolvedValue({
            ...activeAutomationMock,
            openCondition: {
                field: "price1",
                operator: "==",
                value: "0"
            }
        });
        const result = await automationController.startAutomation(inactiveAutomationMock.id!, authorization);
        expect(result.isActive).toBeTruthy();
        automationServiceMock.useValue.startAutomation = jest.fn().mockResolvedValue(activeAutomationMock);
    });

    it('Should NOT start automation (private key)', async () => {
        userServiceMock.useValue.getUser = jest.fn().mockResolvedValue({ ...inactiveAutomationMock, privateKey: null });
        await expect(automationController.startAutomation(inactiveAutomationMock.id!, authorization))
            .rejects
            .toEqual(new Error(`You must have a private key in settings before start an automation.`));
        userServiceMock.useValue.getUser = jest.fn().mockResolvedValue(inactiveAutomationMock);
    });

    it('Should stop automation', async () => {
        const result = await automationController.stopAutomation(activeAutomationMock.id!, authorization);
        expect(result.isActive).toBeFalsy();
    });
})