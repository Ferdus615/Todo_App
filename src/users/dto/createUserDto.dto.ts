import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's first name.",
    example: 'Jane',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: "The user's last name.",
    example: 'Smith',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'jane.smith@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The user's password (should be at least 8 characters).",
    example: 'P@sswOrd123',
    type: String,
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
