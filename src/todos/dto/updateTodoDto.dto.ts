import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Finish the report',
    description: 'Optional new title for the To-Do item.',
    required: false,
    nullable: true,
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Draft, review, and finalize.',
    description: 'Optional new description for the task.',
    required: false,
    nullable: true,
  })
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Update completion status.',
    required: false,
    nullable: true,
  })
  isCompleted?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Update archive status.',
    required: false,
    nullable: true,
  })
  isArchived?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Update soft-delete status (moves to trash).',
    required: false,
    nullable: true,
  })
  isDeleted?: boolean;
}
