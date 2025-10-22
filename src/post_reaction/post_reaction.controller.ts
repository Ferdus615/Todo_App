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
import { UpadateReactionDto } from './dto/updateReactionDto.dto';

@Controller('react')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @Post('/')
  async upsertReaction(
    @Body() dto: CreateReactionDto,
  ): Promise<ResponseReactionDto> {
    return this.postReactionService.upsertReaction(dto);
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

  // @Put('/:id')
  // async updateReaction(
  //   @Param('id') id: string,
  //   @Body('dto') dto: UpadateReactionDto,
  // ) {
  //   const reaction = await this.postReactionService.updateReaction(
  //     parseInt(id, 10),
  //     dto,
  //   );

  //   console.log(reaction);

  //   if (!reaction) throw new NotFoundException(`Item with id:${id} not found!`);

  //   return reaction;
  // }
}
