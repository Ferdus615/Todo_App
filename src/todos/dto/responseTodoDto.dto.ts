import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseTodoDto {
  @Expose()
  @IsNumber()
  @ApiProperty({
    example: 101,
    description: 'The unique ID of the To-Do item.',
  })
  id: number;

  @Expose()
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The ID of the user who owns this To-Do item.',
  })
  user_id: number;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'Complete documentation',
    description: 'The title of the To-Do item.',
  })
  title: string;

  @Expose()
  @IsString()
  @ApiProperty({
    example: 'Write all Swagger decorators for the API.',
    description: 'The detailed description of the task.',
    nullable: true,
  })
  description: string;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Indicates if the task has been completed.',
  })
  @Transform(({ obj }) => obj.iscompleted)
  isCompleted: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Indicates if the task has been archived.',
  })
  @Transform(({ obj }) => obj.isarchived)
  isArchived: boolean;

  @Expose()
  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Indicates if the task has been deleted (soft-delete).',
  })
  @Transform(({ obj }) => obj.isdeleted)
  isDeleted: boolean;
}
