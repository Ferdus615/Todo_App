import { IsEnum, IsInt } from 'class-validator';
import { ReactionType } from '../enum/reactionType.enum';

export class UpadateReactionDto {
  @IsInt()
  id: number;

  @IsEnum(ReactionType)
  reaction_type: ReactionType;

  @IsInt()
  user_id?: number;
}
