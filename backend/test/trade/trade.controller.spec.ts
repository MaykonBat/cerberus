import { Test, TestingModule } from '@nestjs/testing';
import { tradeServiceMock } from "./trade.service.mock";
import { authServiceMock } from "../auth/auth.service.mock";
import { TradeController } from '../../src/trade/trade.controller';

describe('TradeController Tests', () => {
    let tradeController: TradeController;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [TradeController],
            providers: [tradeServiceMock, authServiceMock]
        }).compile();

        tradeController = moduleFixture.get<TradeController>(TradeController);
    });

    it('Should be defined', () => {
        expect(tradeController).toBeDefined();
    });

    it('Should get closed trades', async () => {
        const result = await tradeController.getClosedTrades("authorization", Date.now() - 1, Date.now());
        expect(result.length).toEqual(1);
    });
});