import { Test, TestingModule } from '@nestjs/testing';
import { newTrade, TradeModel } from './trade.service.mock';
import { prismaMock } from '../db.mock';
import { TradeService } from '../../src/trade/trade.service';

describe('TradeService Tests', () => {

    const userId = "user123";
    let tradeService: TradeService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [TradeService],
        }).compile();

        tradeService = moduleFixture.get<TradeService>(TradeService);
    });

    it('Should be defined', () => {
        expect(tradeService).toBeDefined();
    });

    it('Should get closed trades', async () => {
        prismaMock.trades.findMany.mockResolvedValue([{ ...newTrade } as TradeModel]);

        const automations = await tradeService.getClosedTrades(userId, new Date(), new Date());

        expect(automations.length).toEqual(1);
    });
});