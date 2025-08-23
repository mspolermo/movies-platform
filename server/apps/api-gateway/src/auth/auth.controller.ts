import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto, OauthCreateUserDTO } from './dto';
import { ValidationPipe } from '../shared/pipes';
import { JwtAuthGuard } from '../shared/guards';
import { AuthenticatedRequest } from '../shared/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 200 })
  @UsePipes(ValidationPipe)
  @Post('/registration')
  async registrationUser(@Body() dto: CreateUserDto) {
    return await this.authService.registrationUser(dto);
  }

  @ApiOperation({ summary: 'Авторизация через сторонние сайты' })
  @ApiResponse({ status: 200 })
  @UsePipes(ValidationPipe)
  @Post('/outRegistration')
  async outRegistrationUser(@Body() dto: OauthCreateUserDTO) {
    return await this.authService.outRegistrationUser(dto);
  }

  @ApiOperation({ summary: 'Логин' })
  @ApiResponse({ status: 200 })
  @UsePipes(ValidationPipe)
  @Post('/login')
  async loginUser(@Body() dto: AuthDto) {
    return await this.authService.loginUser(dto);
  }

  @ApiOperation({ summary: 'Получение пользователя по токену' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  @UseGuards(JwtAuthGuard)
  @Get('/checkToken')
  async checkToken(@Req() req: AuthenticatedRequest) {
    return await this.authService.checkToken(req.user);
  }
}
