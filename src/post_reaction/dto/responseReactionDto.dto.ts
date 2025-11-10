import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ReactionType } from '../enum/reactionType.enum';
import { Expose } from 'class-transformer';

export class ResponseReactionDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsNumber()
  todo_id: number;

  @Expose()
  @IsEnum(ReactionType)
  reaction_type: ReactionType;

  @Expose()
  @IsOptional()
  @IsNumber()
  user_id?: number;
}
