import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class TodoResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  isCompleted: boolean;

  @IsBoolean()
  isArchived: boolean;

  @IsBoolean()
  isDeleted: boolean;
}
