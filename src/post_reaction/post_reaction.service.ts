import { Injectable } from '@nestjs/common';
import { DbService } from 'src/database/database.service';
import { CreateReactionDto } from './dto/createReactionDto.dto';
import { ResponseReactionDto } from './dto/responseReactionDto.dto';

@Injectable()
export class PostReactionService {
  constructor(private readonly dbService: DbService) {}

  async addReaction(dto: CreateReactionDto): Promise<ResponseReactionDto> {
    const reaction = await this.dbService.query(
      'insert into post_reaction (todo_id, reaction_type, user_id) values ($1, $2, $3) returning *',
      [dto.todo_id, dto.reaction_type, dto.user_id || null],
    );

    return reaction.rows[0];
  }

  async getAllReaction(): Promise<ResponseReactionDto[]> {
    const allReaction = await this.dbService.query(
      'select * from post_reaction',
      [],
    );

    return allReaction.rows;
  }

  async getOneReaction(id: number): Promise<ResponseReactionDto | undefined> {
    const reaction = await this.dbService.query(
      'select * from post_reaction where id= $1',
      [id],
    );

    return reaction.rows[0];
  }

  async getReactionByTodo(
    todo_id: number,
  ): Promise<ResponseReactionDto | undefined> {
    const reactionOfTodo = await this.dbService.query(
      'select * from post_reaction where todo_id = $1',
      [todo_id],
    );

    return reactionOfTodo.rows[0];
  }
}
