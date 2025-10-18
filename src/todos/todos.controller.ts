import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  Param,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';

import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/createTodoDto.dto';
import { UpdateTodoDto } from './dto/updateTodoDto.dto';
import { ResponseTodoDto } from './dto/responseTodoDto.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('/')
  @HttpCode(201)
  async createTodo(@Body() dto: CreateTodoDto): Promise<ResponseTodoDto> {
    return this.todosService.createTodo(dto);
  }

  @Get('/')
  async getAllTodos() {
    return this.todosService.getAllTodos();
  }

  @Get('/completed')
  async isCompletedTask() {
    return this.todosService.getCompletedTask();
  }

  @Get('/archived')
  async isArchivedTask() {
    return this.todosService.getArchivedTask();
  }

  @Get('/deleted')
  async isDeletedTask() {
    return this.todosService.getDeletedTask();
  }

  @Get('/:id')
  async getOneTodo(@Param('id') id: string) {
    const todo = await this.todosService.getOneTodo(parseInt(id, 10));

    if (!todo) {
      throw new NotFoundException(`Todo with id:${id} not found!`);
    }

    return todo;
  }

  @Put('/:id')
  async updateTodo(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    const todoId = parseInt(id, 10);

    const existing = await this.todosService.getOneTodo(todoId);
    if (!existing) throw new NotFoundException(`Todo with id:${id} not found!`);

    if (dto.title || dto.description) {
      return this.todosService.updateTodo(todoId, dto);
    }

    if (
      dto.isCompleted !== undefined ||
      dto.isArchived !== undefined ||
      dto.isDeleted !== undefined
    ) {
      return this.todosService.updateStatus(todoId, dto);
    }

    return existing;
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteTodo(@Param('id') id: string) {
    await this.todosService.deleteTodo(parseInt(id, 10));
  }
}
