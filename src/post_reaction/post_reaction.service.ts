import { Injectable } from '@nestjs/common';
import { DbService } from 'src/database/database.service';
import { CreateReactionDto } from './dto/createReactionDto.dto';
import { ResponseReactionDto } from './dto/responseReactionDto.dto';
import { UpadateReactionDto } from './dto/updateReactionDto.dto';

@Injectable()
export class PostReactionService {
  constructor(private readonly dbService: DbService) {}

  async upsertReaction(dto: CreateReactionDto): Promise<ResponseReactionDto> {
    const react = await this.dbService.query(
      'select * from post_reaction where todo_id = $1 and user_id = $2',
      [dto.todo_id, dto.user_id || null],
    );

    if (react.rows.length === 0) {
      const addReaction = await this.dbService.query(
        'insert into post_reaction (todo_id, reaction_type, user_id) values ($1, $2, $3) returning *',
        [dto.todo_id, dto.reaction_type, dto.user_id || null],
      );

      return addReaction.rows[0];
    } else {
      const updateReaction = await this.dbService.query(
        'update post_reaction set reaction_type = $1, created_at = CURRENT_TIMESTAMP where todo_id = $2 and user_id = $3 returning *',
        [dto.reaction_type, dto.todo_id, dto.user_id || null],
      );

      return updateReaction.rows[0];
    }
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

  // async updateReaction(
  //   id,
  //   dto: UpadateReactionDto,
  // ): Promise<ResponseReactionDto | undefined> {
  //   const react = await this.dbService.query(
  //     'update post_reaction set reaction_type = $1 where id = $2',
  //     [dto.reaction_type, id],
  //   );

  //   return react.rows[0];
  // }
}
