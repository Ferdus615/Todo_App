import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/createUserDto.dto';
import { LoginUserDto } from './dto/loginUserDto.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(201)
  async login(@Body() dto: LoginUserDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    console.log('Decoded user from JWT:', req.user);
    return await this.authService.getProfile(req.user.user_id);
  }

  @Post('/logout')
  async logout() {
    return this.authService.logout();
  }
}
