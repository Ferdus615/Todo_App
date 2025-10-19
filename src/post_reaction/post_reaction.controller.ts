import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostReactionService } from './post_reaction.service';
import { CreateReactionDto } from './dto/createReactionDto.dto';
import { ResponseReactionDto } from './dto/responseReactionDto.dto';
import { todo } from 'node:test';

@Controller('react')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @Post('/')
  async addReaction(
    @Body() dto: CreateReactionDto,
  ): Promise<ResponseReactionDto> {
    return this.postReactionService.addReaction(dto);
  }

  @Get('/')
  async getAllReaction(): Promise<ResponseReactionDto[]> {
    return this.postReactionService.getAllReaction();
  }

  @Get('/:id')
  async getOneReaction(@Param('id') id: string) {
    const reactId = await this.postReactionService.getOneReaction(
      parseInt(id, 10),
    );

    if (!reactId) throw new NotFoundException(`Item with id:${id} not found!`);

    return reactId;
  }

  @Get('/todo/:todo_id')
  async getReactionBtTodo(@Param('todo_id') todo_id: string) {
    const todoReact = await this.postReactionService.getReactionByTodo(
      parseInt(todo_id, 10),
    );

    if (!todoReact)
      throw new NotFoundException(`Item with todo_id:${todo_id} not found!`);

    return todoReact;
  }

  @Put('/:id')
  async
}
