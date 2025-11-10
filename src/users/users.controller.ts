import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ResponseUserDto } from './dto/responseUserDto.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data needed for creation',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request (e.g., email already exists or validation failed).',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.createUser(dto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Retrieve a list of all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of all users.',
    type: [ResponseUserDto], // Indicates an array response
  })
  async getAllUser(): Promise<ResponseUserDto[]> {
    return this.usersService.getAllUser();
  }

  @Get('/email')
  @ApiOperation({ summary: 'Retrieve a user by their email address' })
  @ApiQuery({
    name: 'email',
    description: 'The email of the user to find.',
    required: true,
    example: 'test@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user object if found.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserByEmail(
    @Query('email') email: string,
  ): Promise<ResponseUserDto | undefined> {
    const userWithHash = await this.usersService.getUserByEmail(email);
    if (!userWithHash) return undefined;

    return plainToInstance(ResponseUserDto, userWithHash);
  }

  @Get('/name')
  @ApiOperation({ summary: 'Retrieve a user by first and last name' })
  @ApiQuery({
    name: 'first_name',
    description: 'The first name of the user.',
    required: true,
  })
  @ApiQuery({
    name: 'last_name',
    description: 'The last name of the user.',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user object if found.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserByName(
    @Query('first_name') first_name: string,
    @Query('last_name') last_name: string,
  ): Promise<ResponseUserDto | undefined> {
    return this.usersService.getUserByName(first_name, last_name);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Retrieve a user by their ID' })
  @ApiParam({
    name: 'id',
    description: 'The numeric ID of the user.',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user object.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getuserById(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.usersService.getuserById(id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user by their ID' })
  @ApiParam({
    name: 'id',
    description: 'The numeric ID of the user to delete.',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.usersService.deleteUser(id);
  }
}
