import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';
import { LoginUserDto } from './dto/loginUserDto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @Post('/login')
  async login(@Body() dto: LoginUserDto) {
    return await this.authService.login(dto);
  }

  @Post('/logout')
  async logout() {
    return this.authService.logout();
  }
}
