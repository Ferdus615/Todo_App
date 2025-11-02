import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
}
