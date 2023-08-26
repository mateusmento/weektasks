import { Body, Controller, Delete, Param, Patch, Put } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveSubTask } from './features/subtasks/remove-subtask.command';
import { UpdateSubTask } from './features/subtasks/update-subtask.command';
import { ToggleSubTaskCompletion } from './features/subtasks/toggle-subtask-completion.command';
import { patchObject } from 'src/object.functions';

@Controller('subtasks')
export class SubTasksController {
  constructor(private commandBus: CommandBus) {}

  @Patch(':id')
  updateSubtask(@Param('id') id: number, @Body() command: UpdateSubTask) {
    return this.commandBus.execute(patchObject(command, { id }));
  }

  @Put(':id/completion')
  toggleCompletion(@Param('id') id: number) {
    return this.commandBus.execute(new ToggleSubTaskCompletion(id));
  }

  @Delete(':id')
  removeSubtask(@Param('id') id: number) {
    return this.commandBus.execute(new RemoveSubTask(id));
  }
}
