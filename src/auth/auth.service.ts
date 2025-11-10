import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/loginUserDto.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/users/dto/responseUserDto.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingUser = await this.userService.getUserByEmail(dto.email);
    if (existingUser) throw new ConflictException('Email already exists!');

    const newUser = await this.userService.createUser(dto);
    const payload = {
      sub: newUser.id,
      name: `${newUser.first_name} ${newUser.last_name}`,
      email: newUser.email,
    };

    return {
      message: 'User register successfully',
      access_token: await this.jwtService.signAsync(payload),
      user: newUser,
    };
  }

  async login(@Body() dto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password!');

    const matchPass = await bcrypt.compare(dto.password, user.password);
    if (!matchPass)
      throw new UnauthorizedException('Invalid email or password!');

    const payload = {
      sub: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    };

    const userResponse = plainToInstance(ResponseUserDto, user);

    return {
      message: 'Login successful',
      access_token: await this.jwtService.signAsync(payload),
      user: userResponse,
    };
  }

  async getProfile(user_id: number) {
    const user = await this.userService.getuserById(user_id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async logout() {
    return {
      message:
        'Logout successful. Token invalidation not persisted (stateless JWT).',
    };
  }
}
