import { Injectable } from '@nestjs/common';
import { DbService } from 'src/database/database.service';
import { CreateReactionDto } from './dto/createReactionDto.dto';
import { ResponseReactionDto } from './dto/responseReactionDto.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostReactionService {
  constructor(private readonly dbService: DbService) {}

  async upsertReaction(
    dto: CreateReactionDto,
    user_id: number,
  ): Promise<ResponseReactionDto> {
    const react = await this.dbService.query(
      'select * from post_reaction where todo_id = $1 and user_id = $2',
      [dto.todo_id, user_id],
    );

    if (react.rows.length === 0) {
      const addReaction = await this.dbService.query(
        'insert into post_reaction (todo_id, reaction_type, user_id) values ($1, $2, $3) returning *',
        [dto.todo_id, dto.reaction_type, user_id],
      );

      return plainToInstance(ResponseReactionDto, addReaction.rows[0], {
        excludeExtraneousValues: true,
      });
    } else {
      const updateReaction = await this.dbService.query(
        'update post_reaction set reaction_type = $1, created_at = CURRENT_TIMESTAMP where todo_id = $2 and user_id = $3 returning *',
        [dto.reaction_type, dto.todo_id, user_id],
      );

      return plainToInstance(ResponseReactionDto, updateReaction.rows[0], {
        excludeExtraneousValues: true,
      });
    }
  }

  async getAllReaction(): Promise<ResponseReactionDto[]> {
    const allReaction = await this.dbService.query(
      'select * from post_reaction',
      [],
    );

    return plainToInstance(ResponseReactionDto, allReaction.rows, {
      excludeExtraneousValues: true,
    });
  }

  async getOneReaction(id: number): Promise<ResponseReactionDto | undefined> {
    const reaction = await this.dbService.query(
      'select * from post_reaction where id= $1',
      [id],
    );

    return plainToInstance(ResponseReactionDto, reaction.rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async getReactionByTodo(
    todo_id: number,
  ): Promise<ResponseReactionDto | undefined> {
    const reactionOfTodo = await this.dbService.query(
      'select * from post_reaction where todo_id = $1',
      [todo_id],
    );
    return plainToInstance(ResponseReactionDto, reactionOfTodo.rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async getReactionByUser(
    user_id: number,
  ): Promise<ResponseReactionDto[] | undefined> {
    const reactionOfUser = await this.dbService.query(
      'select * from post_reaction where user_id = $1',
      [user_id],
    );

    return plainToInstance(ResponseReactionDto, reactionOfUser.rows, {
      excludeExtraneousValues: true,
    });
  }
}
