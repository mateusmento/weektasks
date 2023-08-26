import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FindBoard } from './features/find-board.query';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/products/:id/board')
export class BoardController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  getBoard(@Param('id') productId: number) {
    const query = new FindBoard({ productId });
    return this.queryBus.execute(query);
  }
}
