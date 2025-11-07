import { IsString, MinLength } from 'class-validator';
import { ResponseUserDto } from './responseUserDto.dto';

export class UserWithPassword extends ResponseUserDto {
  @IsString()
  @MinLength(8)
  password: string;
}
