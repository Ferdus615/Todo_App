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
import { TodosService, Todo } from './todos.service';
import { CreateTodoDto } from './dto/createTodoDto.dto';
import { UpdateTodoDto } from './dto/updateTodoDto.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post('/')
  @HttpCode(201)
  async createTodo(@Body() todo: CreateTodoDto): Promise<Todo> {
    return this.todosService.createTodo(todo.title, todo.description);
  }

  @Get('/')
  async getAllTodos() {
    return this.todosService.getAllTodos();
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
  async updateTodo(@Param('id') id: string, @Body() todo: UpdateTodoDto) {
    const todoId = parseInt(id, 10);

    const isTodoExist = await this.todosService.getOneTodo(todoId);
    if (!isTodoExist) {
      throw new NotFoundException(`Todo with id:${id} not found!`);
    }

    if (todo.title || todo.description) {
      return this.todosService.updateTodo(
        todoId,
        todo.title ?? isTodoExist.title,
        todo.description ?? isTodoExist.description,
      );
    }

    if (todo.completed !== undefined) {
      return this.todosService.updateStatus(todoId, todo.completed);
    }

    return isTodoExist;
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteTodo(@Param('id') id: string) {
    await this.todosService.deleteTodo(parseInt(id, 10));
  }
}
