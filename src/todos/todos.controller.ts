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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('todos')
@ApiBearerAuth() // Apply Bearer Auth security globally to all methods in this controller
@Controller('todo')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new To-Do item' })
  @ApiResponse({
    status: 201,
    description: 'The To-Do item has been successfully created and returned.',
    type: ResponseTodoDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
  async createTodo(
    @Body() dto: CreateTodoDto,
    @Req() req: Request,
  ): Promise<ResponseTodoDto> {
    const user = (req as any).user as { user_id: number; email: string };
    return this.todosService.createTodo(dto, user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiOperation({
    summary:
      'Retrieve all To-Do items (including completed, archived, and deleted tasks) for all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of all To-Do items.',
    type: [ResponseTodoDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
  async getAllTodos() {
    return this.todosService.getAllTodos();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/completed')
  @ApiOperation({ summary: 'Retrieve all completed To-Do items.' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of completed To-Do items.',
    type: [ResponseTodoDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
  async isCompletedTask() {
    return this.todosService.getCompletedTask();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/archived')
  @ApiOperation({ summary: 'Retrieve all archived To-Do items.' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of archived To-Do items.',
    type: [ResponseTodoDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
  async isArchivedTask() {
    return this.todosService.getArchivedTask();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/deleted')
  @ApiOperation({ summary: 'Retrieve all soft-deleted To-Do items (trash).' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of soft-deleted To-Do items.',
    type: [ResponseTodoDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
  async isDeletedTask() {
    return this.todosService.getDeletedTask();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @ApiOperation({
    summary: 'Retrieve all To-Do items belonging to the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns tasks for the current user.',
    type: [ResponseTodoDto],
  })
  @ApiResponse({
    status: 404,
    description: 'To-Do items for the user were not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
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
  @ApiOperation({ summary: 'Retrieve a single To-Do item by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the To-Do item to retrieve',
    example: 101,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested To-Do item.',
    type: ResponseTodoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'To-Do item with the specified ID was not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
  async getOneTodo(@Param('id') id: string) {
    const todo = await this.todosService.getOneTodo(parseInt(id, 10));

    if (!todo) {
      throw new NotFoundException(`Todo with id:${id} not found!`);
    }

    return todo;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Update an existing To-Do item' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the To-Do item to update',
    example: 101,
  })
  @ApiBody({
    type: UpdateTodoDto,
    description:
      'Provide new title/description, or status fields (isCompleted, isArchived, isDeleted).',
  })
  @ApiResponse({
    status: 200,
    description: 'The To-Do item was successfully updated and returned.',
    type: ResponseTodoDto,
  })
  @ApiResponse({
    status: 404,
    description: 'To-Do item with the specified ID was not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
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
  @ApiOperation({ summary: 'Permanently delete a To-Do item by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the To-Do item to delete',
    example: 101,
  })
  @ApiResponse({
    status: 204,
    description: 'The To-Do item was successfully deleted (No Content).',
  })
  @ApiResponse({
    status: 404,
    description: 'To-Do item with the specified ID was not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized due to missing or invalid JWT.',
  })
  async deleteTodo(@Param('id') id: string, @Param('user_id') user_id: string) {
    await this.todosService.deleteTodo(parseInt(id, 10), parseInt(user_id, 10));
  }
}
