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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @HttpCode(201)
  async createUser(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.createUser(dto);
  }

  @Get('/')
  async getAllUser(): Promise<ResponseUserDto[]> {
    return this.usersService.getAllUser();
  }

  @Get('/:id')
  async getuserById(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.usersService.getuserById(id);
  }

  @Get('/email')
  async getUserByEmail(
    @Query('email') email: string,
  ): Promise<ResponseUserDto | undefined> {
    return this.usersService.getUserByEmail(email);
  }

  @Get('/name')
  async getUserByName(
    @Query('first_name') first_name: string,
    @Query('last_name') last_name: string,
  ): Promise<ResponseUserDto | undefined> {
    return this.usersService.getUserByName(first_name, last_name);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.usersService.deleteUser(id);
  }
}
