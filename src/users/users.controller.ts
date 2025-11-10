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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
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

  @Get('/email')
  async getUserByEmail(
    @Query('email') email: string,
  ): Promise<ResponseUserDto | undefined> {
    const userWithHash = await this.usersService.getUserByEmail(email);
    if (!userWithHash) return undefined;

    return plainToInstance(ResponseUserDto, userWithHash);
  }

  @Get('/name')
  async getUserByName(
    @Query('first_name') first_name: string,
    @Query('last_name') last_name: string,
  ): Promise<ResponseUserDto | undefined> {
    return this.usersService.getUserByName(first_name, last_name);
  }

  @Get('/:id')
  async getuserById(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.usersService.getuserById(id);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<ResponseUserDto> {
    return this.usersService.deleteUser(id);
  }
}
