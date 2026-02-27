import { ChainId } from 'commons';
import { Exchange } from 'commons';
import { PoolService } from '../../src/pool/pool.service';

export type poolModel = {
  id: string;
  token0: string;
  token1: string;
  symbol: string;
  symbol0: string;
  symbol1: string;
  decimals0: number;
  decimals1: number;
  fee: number;
  exchange: Exchange;
  network: ChainId;
  price0: number;
  price0Change: number;
  price0_15: number | null;
  price0Change_15: number | null;
  price0_60: number | null;
  price0Change_60: number | null;
  price1: number;
  price1Change: number;
  price1_15: number | null;
  price1Change_15: number | null;
  price1_60: number | null;
  price1Change_60: number | null;
  lastUpdate: Date;
  lastUpdate_15: Date | null;
  lastUpdate_60: Date | null;
};

export const poolMock = {
  id: '0x000024feb293b6c6c3a80a95f1f830a8746400b9',
  token0: '0x6aa56e1d98b3805921c170eb4b3fe7d4fda6d89b',
  token1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  symbol: 'TRUMPWETH',
  symbol0: 'TRUMP',
  symbol1: 'WETH',
  decimals0: 1000000,
  decimals1: 1000000000000000,
  fee: 10000,
  exchange: 1,
  network: 1,
  price0: 697.9687750256548431903030779836248,
  price0Change: 0,
  price0_15: 0,
  price0Change_15: 0,
  price0_60: 0,
  price0Change_60: 0,
  price1: 0.001432728849457833648837565738741238,
  price1Change: 0,
  price1_15: 0,
  price1Change_15: 0,
  price1_60: 0,
  price1Change_60: 0,
  lastUpdate: new Date(),
  lastUpdate_15: new Date(),
  lastUpdate_60: new Date(),
};

export const poolServiceMock = {
  provide: PoolService,
  useValue: {
    getPool: jest.fn().mockResolvedValue(poolMock),
    searchPool: jest.fn().mockResolvedValue([poolMock]),
    getPools: jest.fn().mockResolvedValue([poolMock]),
    getPoolSymbols: jest.fn().mockResolvedValue([poolMock.symbol]),
    getTopPools: jest.fn().mockResolvedValue([poolMock]),
  },
};
