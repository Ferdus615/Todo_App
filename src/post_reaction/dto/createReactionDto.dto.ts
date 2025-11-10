import { IsEnum, IsInt } from 'class-validator';
import { ReactionType } from '../enum/reactionType.enum';

export class CreateReactionDto {
  @IsInt()
  todo_id: number;

  @IsEnum(ReactionType)
  reaction_type: ReactionType;
}
