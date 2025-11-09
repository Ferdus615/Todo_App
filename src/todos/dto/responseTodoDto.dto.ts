import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class ResponseTodoDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsBoolean()
  @Transform(({ obj }) => obj.iscompleted)
  isCompleted: boolean;

  @Expose()
  @IsBoolean()
  @Transform(({ obj }) => obj.isarchived)
  isArchived: boolean;

  @Expose()
  @IsBoolean()
  @Transform(({ obj }) => obj.isdeleted)
  isDeleted: boolean;
}
