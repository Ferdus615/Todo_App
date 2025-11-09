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
  UseGuards,
  Req,
} from '@nestjs/common';

import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/createTodoDto.dto';
import { UpdateTodoDto } from './dto/updateTodoDto.dto';
import { ResponseTodoDto } from './dto/responseTodoDto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todo')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @HttpCode(201)
  async createTodo(
    @Body() dto: CreateTodoDto,
    @Req() req: Request,
  ): Promise<ResponseTodoDto> {
    const user = (req as any).user as { user_id: number; email: string };
    return this.todosService.createTodo(dto, user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllTodos() {
    return this.todosService.getAllTodos();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/completed')
  async isCompletedTask() {
    return this.todosService.getCompletedTask();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/archived')
  async isArchivedTask() {
    return this.todosService.getArchivedTask();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/deleted')
  async isDeletedTask() {
    return this.todosService.getDeletedTask();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getTodoByUser(@Req() req) {
    const user = req.user as { user_id: number };

    const task = await this.todosService.getTodoByUser(user.user_id);

    if (!task) {
      throw new NotFoundException(`Todo for user:${user.user_id} not found`);
    }

    return task;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getOneTodo(@Param('id') id: string) {
    const todo = await this.todosService.getOneTodo(parseInt(id, 10));

    if (!todo) {
      throw new NotFoundException(`Todo with id:${id} not found!`);
    }

    return todo;
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @HttpCode(204)
  async deleteTodo(@Param('id') id: string, @Param('user_id') user_id: string) {
    await this.todosService.deleteTodo(parseInt(id, 10), parseInt(user_id, 10));
  }
}
