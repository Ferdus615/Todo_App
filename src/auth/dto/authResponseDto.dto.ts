import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ResponseUserDto } from 'src/users/dto/responseUserDto.dto';

/**
 * DTO used by NestJS Swagger (@nestjs/swagger) to define the schema
 * for the successful response returned by the /auth/register and /auth/login endpoints.
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'A friendly status message from the server.',
    example: 'Login successful',
    type: String,
  })
  message: string;

  @ApiProperty({
    description:
      'The JSON Web Token (JWT) required for accessing protected routes (e.g., /auth/profile).',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2NzgwMzUyMDAsImV4cCI6MTY3ODA0MjQwMH0.ABCDEFGHIJKLM',
    name: 'access_token',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description:
      'Details of the newly created or authenticated user (excluding sensitive data like password hash).',
    type: ResponseUserDto,
  })
  @Type(() => ResponseUserDto)
  user: ResponseUserDto;
}
