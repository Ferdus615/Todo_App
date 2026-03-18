import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the new To-Do item.',
    maxLength: 255,
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Milk, bread, and eggs.',
    description: 'Optional detailed description of the task.',
    required: false,
    nullable: true,
  })
  description: string;
}
