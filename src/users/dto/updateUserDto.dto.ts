import { IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @MinLength(8)
  @IsString()
  password: string;
}
