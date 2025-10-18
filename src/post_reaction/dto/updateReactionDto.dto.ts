import { IsEnum } from 'class-validator';
import { ReactionType } from '../enum/reactionType.enum';

export class UpadateReactionDto {
  @IsEnum(ReactionType)
  reaction_type: ReactionType;
}
