import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

export class ReactionResponseDto {
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
