import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto, OauthCreateUserDTO } from './dto';
import { ValidationPipe } from '../shared/pipes';
import { JwtAuthGuard, Public } from '../shared/guards';
import { AuthenticatedRequest } from '../shared/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 200, description: 'Пользователь зарегистрирован' })
  @UsePipes(ValidationPipe)
  @Post('/registration')
  async registrationUser(@Body() dto: CreateUserDto) {
    return await this.authService.registrationUser(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Авторизация через сторонние сайты' })
  @ApiResponse({ status: 200, description: 'OAuth регистрация' })
  @UsePipes(ValidationPipe)
  @Post('/outRegistration')
  async outRegistrationUser(@Body() dto: OauthCreateUserDTO) {
    return await this.authService.outRegistrationUser(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Логин' })
  @ApiResponse({ status: 200, description: 'Пользователь авторизован' })
  @UsePipes(ValidationPipe)
  @Post('/login')
  async loginUser(@Body() dto: AuthDto) {
    return await this.authService.loginUser(dto);
  }

  @ApiOperation({ summary: 'Получение пользователя по токену' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('/checkToken')
  async checkToken(@Req() req: AuthenticatedRequest) {
    return await this.authService.checkToken(req.user);
  }

  @ApiOperation({ summary: 'Обновление JWT токена' })
  @ApiResponse({ status: 200, description: 'Новый токен' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refreshToken(@Req() req: AuthenticatedRequest) {
    return await this.authService.refreshToken(req.user);
  }
}
