import { Exclude } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ResponseUserDto {
  @IsNumber()
  id: number;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}
