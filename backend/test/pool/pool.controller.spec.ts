import { Test, TestingModule } from '@nestjs/testing';
import { poolMock, poolModel, poolServiceMock } from './pool.service.mock';
import { prismaMock } from '../db.mock';
import { PoolController } from '../../src/pool/pool.controller';
import { authServiceMock } from '../auth/auth.service.mock';
import { NotFoundException } from '@nestjs/common';

describe('PoolController Tests', () => {
  let poolController: PoolController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PoolController],
      providers: [poolServiceMock, authServiceMock],
    }).compile();

    poolController = moduleFixture.get<PoolController>(PoolController);
  });

  it('Should be Defined', () => {
    expect(poolController).toBeDefined();
  });

  it('Should get pool', async () => {
    const pool = await poolController.getPool(poolMock.id);
    expect(pool).toBeDefined();
    expect(pool.id).toEqual(poolMock.id);
  });

  it('Should NOT get pool', async () => {
    poolServiceMock.useValue.getPool.mockResolvedValue(null);
    await expect(poolController.getPool(poolMock.id)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  it('Should search pool', async () => {
    const pool = await poolController.searchPool(poolMock.symbol, poolMock.fee);
    expect(pool).toBeDefined();
    expect(pool.symbol).toEqual(poolMock.symbol);
    expect(pool.fee).toEqual(poolMock.fee);
  });

  it('Should NOT search pool', async () => {
    poolServiceMock.useValue.searchPool.mockResolvedValue(null);
    await expect(
      poolController.searchPool(poolMock.symbol, poolMock.fee),
    ).rejects.toEqual(new NotFoundException());
  });

  it('Should get pools', async () => {
    const pools = await poolController.getPools(1, 1);
    expect(pools).toBeDefined();
    expect(pools.length).toEqual(1);
    expect(pools[0].id).toEqual(poolMock.id);
  });

  it('Should get TOP pools', async () => {
    const pools = await poolController.topPools();
    expect(pools).toBeDefined();
    expect(pools.length).toEqual(1);
    expect(pools[0].id).toEqual(poolMock.id);
  });

  it('Should get symbols', async () => {
    const symbols = await poolController.getPoolSymbols();
    expect(symbols).toBeDefined();
    expect(symbols.length).toEqual(1);
    expect(symbols[0]).toEqual(poolMock.symbol);
  });
});
