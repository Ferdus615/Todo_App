import { IsEnum, IsInt } from 'class-validator';
import { ReactionType } from '../enum/reactionType.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReactionDto {
  @IsInt()
  @ApiProperty({
    example: 101,
    description: 'The ID of the To-Do item to react to.',
  })
  todo_id: number;

  @IsEnum(ReactionType)
  @ApiProperty({
    example: 'heart',
    description: 'The type of reaction to submit (e.g., "like", "heart").',
  })
  reaction_type: ReactionType;
}
