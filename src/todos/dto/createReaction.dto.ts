import { isEnum, IsEnum, IsIn, IsInt, IsOptional } from 'class-validator';
import { ReactionType } from '../enums/reaction.enum';

export class CreateReactionDto {
  @IsInt()
  todoId: number;

  @IsEnum(ReactionType)
  reactionType: ReactionType;

  @IsOptional()
  @IsInt()
  userId?: number;
}
