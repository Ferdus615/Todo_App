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
import { AuthResponseDto } from './dto/authResponseDto.dto';
import { ResponseUserDto } from 'src/users/dto/responseUserDto.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto, description: 'User data for registration' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Returns token and user data.',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Validation Error' })
  async register(@Body() dto: CreateUserDto) {
    return await this.authService.register(dto);
  }

  @Post('/login')
  @HttpCode(201)
  @ApiOperation({ summary: 'Log in and receive an access token' })
  @ApiBody({ type: LoginUserDto, description: 'User credentials for login' })
  @ApiResponse({
    status: 201,
    description: 'Successful login. Returns access token and user data.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Invalid credentials',
  })
  async login(@Body() dto: LoginUserDto) {
    return await this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth() // 👈 Documents that this endpoint requires a Bearer Token
  @ApiOperation({ summary: 'Retrieve the profile of the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the profile details of the current user.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Missing or invalid token.',
  })
  async getProfile(@Req() req) {
    console.log('Decoded user from JWT:', req.user);
    return await this.authService.getProfile(req.user.user_id);
  }

  @Post('/logout')
  @ApiOperation({
    summary: 'Log out user (typically by invalidating the token)',
  })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  async logout() {
    return this.authService.logout();
  }
}
