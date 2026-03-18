import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ReactionType } from '../enum/reactionType.enum';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseReactionDto {
  @Expose()
  @IsNumber()
  @ApiProperty({
    example: 42,
    description: 'The unique ID of the reaction record.',
  })
  id: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    example: 101,
    description: 'The ID of the To-Do item the reaction is applied to.',
  })
  todo_id: number;

  @Expose()
  @IsEnum(ReactionType)
  @ApiProperty({
    example: 'like',
    description:
      'The type of reaction (e.g., "like", "love", "haha", "wow", "angry", etc.).',
  })
  reaction_type: ReactionType;

  @Expose()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the reaction.',
  })
  user_id?: number;
}
