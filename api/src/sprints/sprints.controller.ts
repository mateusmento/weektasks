import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/application/passport/jwt.strategy';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { patchObject } from 'src/object.functions';
import { RemoveSprintBacklogItemComand } from './features/remove-sprint-backlog-item.command';
import { IncludeSprintBacklogItemCommand } from './features/include-sprint-backlog-item.command';
import { MoveSprintBacklogItemCommand } from './features/move-sprint-backlog-item.command';
import { MoveSprintCommand } from './features/move-sprint.command';
import { CreateIssueInSprintCommand } from './features/create-issue-in-sprint.command';
import { RemoveSprintCommand } from './features/remove-sprint.command';
import { CreateSprintCommand } from './features/create-sprint.command';
import { FindSprintsQuery } from './features/find-sprints.query';
import { UpdateSprintCommand } from './features/update-sprint.command';
import {
  CannotEndSprintException,
  CannotStartSprintException,
} from './entities/sprint.entity';
import { StartSprintCommand } from './features/start-sprint.command';
import { EndSprintCommand } from './features/end-sprint.command';
import { FindPastSprints } from './features/find-past-sprints.query';

@UseGuards(JwtAuthGuard)
@Controller('/products/:productId')
export class ProductsSprintsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Post('/sprints')
  create(
    @Param('productId') productId: number,
    @Body() command: CreateSprintCommand
  ) {
    command = patchObject(command, { productId });
    return this.commandBus.execute(command);
  }

  @Get('/sprints')
  findAll(@Param('productId') productId: number) {
    const query = patchObject(new FindSprintsQuery(), { productId });
    return this.queryBus.execute(query);
  }

  @Get('/past-sprints')
  findPastSprints(@Param('productId') productId: number) {
    const query = patchObject(new FindPastSprints(), { productId });
    return this.queryBus.execute(query);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('/sprints/:sprintId')
export class SprintIssuesController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/issues')
  createIssue(
    @Param('sprintId') sprintId: number,
    @Body() command: CreateIssueInSprintCommand
  ) {
    command = patchObject(command, { sprintId });
    return this.commandBus.execute(command);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('/sprints/:sprintId')
export class SprintsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  update(@Param('sprintId') id: number, @Body() command: UpdateSprintCommand) {
    command = patchObject(command, { id });
    return this.commandBus.execute(command);
  }

  @Delete()
  remove(@Param('sprintId') id: number) {
    const command = patchObject(new RemoveSprintCommand(), { id });
    return this.commandBus.execute(command);
  }

  @Put('/order')
  moveSprint(@Param('sprintId') id: number, @Body('order') order: number) {
    const command = patchObject(new MoveSprintCommand(), { id, order });
    return this.commandBus.execute(command);
  }

  @Post('/start')
  async startSprint(@Param('sprintId') sprintId: number) {
    try {
      const command = new StartSprintCommand({ sprintId });
      return await this.commandBus.execute(command);
    } catch (ex) {
      if (ex instanceof CannotStartSprintException)
        throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
      else throw ex;
    }
  }

  @Post('/end')
  async endSprint(@Param('sprintId') sprintId: number) {
    try {
      const command = new EndSprintCommand({ sprintId });
      return await this.commandBus.execute(command);
    } catch (ex) {
      if (ex instanceof CannotEndSprintException)
        throw new HttpException(ex.message, HttpStatus.BAD_REQUEST);
      else throw ex;
    }
  }

  @Post('/backlog-items')
  includeSprintBacklogItem(
    @Param('sprintId') sprintId: number,
    @Body() command: IncludeSprintBacklogItemCommand
  ) {
    command = patchObject(command, { sprintId });
    return this.commandBus.execute(command);
  }

  @Put('/backlog-items/:issueId/order')
  moveSprintBacklogItem(
    @Param('issueId') issueId: number,
    @Param('sprintId') sprintId: number,
    @Body('order') order: number
  ) {
    const command = patchObject(new MoveSprintBacklogItemCommand(), {
      issueId,
      sprintId,
      order,
    });
    return this.commandBus.execute(command);
  }

  @Delete('/backlog-items/:issueId')
  removeSprintBacklogItem(
    @Param('sprintId') sprintId: number,
    @Param('issueId') issueId: number
  ) {
    const command = patchObject(new RemoveSprintBacklogItemComand(), {
      sprintId,
      issueId,
    });
    return this.commandBus.execute(command);
  }
}
