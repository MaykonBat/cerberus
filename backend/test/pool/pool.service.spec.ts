import { Test, TestingModule } from '@nestjs/testing';
import { poolMock, poolModel } from './pool.service.mock';
import { prismaMock } from '../db.mock';
import {
  NotFoundException,
} from '@nestjs/common';
import { PoolService } from '../../src/pool/pool.service';
import { JsonObject } from '@prisma/client/runtime/library';

describe('PoolService Tests', () => {
  let poolService: PoolService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [PoolService],
    }).compile();

    poolService = moduleFixture.get<PoolService>(PoolService);
  });

  it('Should be Defined', () => {
    expect(poolService).toBeDefined();
  });

  it('Should get pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue({
      ...poolMock,
    } as poolModel);

    const result = await poolService.getPool(poolMock.id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(poolMock.id);
  });

  it('Should NOT get pool', async () => {
    prismaMock.pools.findUnique.mockResolvedValue(null);

    await expect(poolService.getPool(poolMock.id)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  it('Should search pool', async () => {
    prismaMock.pools.findFirst.mockResolvedValue({
      ...poolMock,
    } as poolModel);

    const result = await poolService.searchPool(poolMock.symbol, poolMock.fee);
    expect(result).toBeDefined();
    expect(result.symbol).toEqual(poolMock.symbol);
    expect(result.fee).toEqual(poolMock.fee);
  });

  it('Should NOT search pool', async () => {
    prismaMock.pools.findFirst.mockResolvedValue(null);

    await expect(
      poolService.searchPool(poolMock.symbol, poolMock.fee),
    ).rejects.toEqual(new NotFoundException());
  });

  it('Should get pools', async () => {
    prismaMock.pools.findMany.mockResolvedValue([
      {
        ...poolMock,
      },
    ] as poolModel[]);

    const pageSize = 1;
    const result = await poolService.getPools(1, 1);
    expect(result).toBeDefined();
    expect(result.length).toEqual(pageSize);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('Should get pools (defaults)', async () => {
    prismaMock.pools.findMany.mockResolvedValue([
      {
        ...poolMock,
      },
    ] as poolModel[]);

    const pageSize = 1;
    const result = await poolService.getPools();
    expect(result).toBeDefined();
    expect(result.length).toEqual(pageSize);
    expect(result[0].id).toEqual(poolMock.id);
  });

  it('Should get symbols', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue([
      { _id: poolMock.symbol },
    ] as unknown as JsonObject);

    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(poolMock.symbol);
  });

  it('Should NOT get symbols', async () => {
    prismaMock.pools.aggregateRaw.mockResolvedValue(null!);

    const result = await poolService.getPoolSymbols();
    expect(result).toBeDefined();
    expect(result.length).toEqual(0);
  });

  it('Should get Top pools', async () => {
    prismaMock.pools.findMany.mockResolvedValue([
      {
        ...poolMock,
      },
    ] as poolModel[]);

    const result = await poolService.getTopPools();
    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(result[0].id).toEqual(poolMock.id);
  });
});
