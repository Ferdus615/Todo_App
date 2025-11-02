import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';
import { ResponseUserDto } from 'src/users/dto/responseUserDto.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.userService.getUserByEmail(dto.email);
    if (!existingUser) throw new ConflictException('Email already exists!');

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

  async login(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password!');

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass)
      throw new UnauthorizedException('Invalid email or password!');

    const payload = {
      sub: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    };

    return {
      messsage: 'Login successful',
      access_token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async logout() {
    return {
      message:
        'Logout successful. Token invalidation not persisted (stateless JWT).',
    };
  }
}
