import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @Expose()
  @ApiProperty({
    description: 'The unique ID of the user.',
    example: 101,
    type: Number,
  })
  @IsNumber()
  id: number;

  @Expose({ name: 'first_name' })
  @ApiProperty({
    description: 'The first name of the user.',
    example: 'John',
    type: String,
  })
  @IsString()
  first_name: string;

  @Expose({ name: 'last_name' })
  @ApiProperty({
    description: 'The last name of the user.',
    example: 'Doe',
    type: String,
  })
  @IsString()
  last_name: string;

  @Expose()
  @ApiProperty({
    description: 'The email address of the user (must be unique).',
    example: 'john.doe@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  created_at: string;

  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}
