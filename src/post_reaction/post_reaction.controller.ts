import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostReactionService } from './post_reaction.service';
import { CreateReactionDto } from './dto/createReactionDto.dto';
import { ResponseReactionDto } from './dto/responseReactionDto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('react')
@ApiBearerAuth('defaultBearerAuth') // Applies JWT security to all routes
@Controller('react')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiOperation({
    summary: 'Create a new reaction or update an existing one (upsert)',
  })
  @ApiBody({
    type: CreateReactionDto,
    description: 'To-Do ID and reaction type.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reaction successfully created or updated.',
    type: ResponseReactionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Missing or invalid token.',
  })
  async upsertReaction(
    @Body() dto: CreateReactionDto,
    @Req() req,
  ): Promise<ResponseReactionDto> {
    const user = (req as any).user as { user_id: number };
    return this.postReactionService.upsertReaction(dto, user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiOperation({
    summary: 'Retrieve all reactions across all users and To-Do items',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of all reactions.',
    type: [ResponseReactionDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Missing or invalid token.',
  })
  async getAllReaction(): Promise<ResponseReactionDto[]> {
    return this.postReactionService.getAllReaction();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a single reaction record by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the reaction record',
    example: 42,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested reaction record.',
    type: ResponseReactionDto,
  })
  @ApiResponse({ status: 404, description: 'Reaction record not found.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Missing or invalid token.',
  })
  async getOneReaction(@Param('id') id: string) {
    const reactId = await this.postReactionService.getOneReaction(
      parseInt(id, 10),
    );

    if (!reactId) throw new NotFoundException(`Item with id:${id} not found!`);

    return reactId;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/todo/:todo_id')
  @ApiOperation({ summary: 'Retrieve all reactions for a specific To-Do item' })
  @ApiParam({
    name: 'todo_id',
    description: 'The ID of the To-Do item',
    example: 101,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of reactions for the specified To-Do item.',
    type: [ResponseReactionDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No reactions found for this To-Do ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Missing or invalid token.',
  })
  async getReactionByTodo(@Param('todo_id') todo_id: string) {
    const todoReact = await this.postReactionService.getReactionByTodo(
      parseInt(todo_id, 10),
    );

    if (!todoReact)
      throw new NotFoundException(`Item with todo_id:${todo_id} not found!`);

    return todoReact;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:user_id')
  @ApiOperation({
    summary: 'Retrieve all reactions created by a specific user',
  })
  @ApiParam({ name: 'user_id', description: 'The ID of the user', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of reactions created by the specified user.',
    type: [ResponseReactionDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No reactions found for this user ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Missing or invalid token.',
  })
  async getReactionByUser(@Param('user_id') user_id: string) {
    const userTodo = await this.postReactionService.getReactionByUser(
      parseInt(user_id, 10),
    );

    if (!userTodo)
      throw new NotFoundException(`Todo for user${user_id} not found!`);

    return userTodo;
  }
}
