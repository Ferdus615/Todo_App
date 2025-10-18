import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ReactionType } from '../enum/reactionType.enum';

export class ResponseReactionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  todo_id: number;

  @IsEnum(ReactionType)
  reaction_type: ReactionType;

  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsDateString()
  created_at: string;
}
