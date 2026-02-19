import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PoolService } from './pool.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('pools')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @UseGuards(AuthGuard)
  @Get('symbols')
  async getPoolSymbols() {
    return this.poolService.getPoolSymbols();
  }

  @UseGuards(AuthGuard)
  @Get('top')
  async topPools() {
    return this.poolService.getTopPools();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getPool(@Param('id') id: string) {
    const pool = await this.poolService.getPool(id);
    if (!pool) throw new NotFoundException();
    return pool;
  }

  @UseGuards(AuthGuard)
  @Get(':symbol/:fee')
  async searchPool(
    @Param('symbol') symbol: string,
    @Param('fee', ParseIntPipe) fee: number,
  ) {
    const pool = await this.poolService.searchPool(symbol, fee);
    if (!pool) throw new NotFoundException();
    return pool;
  }

  @UseGuards(AuthGuard)
  @Get()
  async getPools(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return this.poolService.getPools(page, pageSize);
  }
}
