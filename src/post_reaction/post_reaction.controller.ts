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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('react')
@Controller('react')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async upsertReaction(
    @Body() dto: CreateReactionDto,
    @Req() req,
  ): Promise<ResponseReactionDto> {
    const user = (req as any).user as { user_id: number };
    return this.postReactionService.upsertReaction(dto, user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllReaction(): Promise<ResponseReactionDto[]> {
    return this.postReactionService.getAllReaction();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getOneReaction(@Param('id') id: string) {
    const reactId = await this.postReactionService.getOneReaction(
      parseInt(id, 10),
    );

    if (!reactId) throw new NotFoundException(`Item with id:${id} not found!`);

    return reactId;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/todo/:todo_id')
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
  async getReactionByUser(@Param('user_id') user_id: string) {
    const userTodo = await this.postReactionService.getReactionByUser(
      parseInt(user_id, 10),
    );

    if (!userTodo)
      throw new NotFoundException(`Todo for user${user_id} not found!`);

    return userTodo;
  }
}
