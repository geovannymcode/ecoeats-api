import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

@ApiTags('Auth')
@Controller('api/securities')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro de nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async register(@Body() dto: RegisterRequestDto): Promise<ApiResponseDto<RegisterResponseDto>> {
    const result = await this.authService.register(dto);
    return ApiResponseDto.ok(result, 'Usuario registrado correctamente');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginRequestDto): Promise<ApiResponseDto<LoginResponseDto>> {
    const result = await this.authService.login(dto);
    return ApiResponseDto.ok(result, 'Login exitoso');
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña (envía OTP por email)' })
  @ApiResponse({ status: 200, description: 'OTP enviado al email' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ApiResponseDto<null>> {
    await this.authService.forgotPassword(dto);
    return ApiResponseDto.ok(null, 'Se envió un código de verificación a tu email');
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar OTP de recuperación de contraseña' })
  @ApiResponse({ status: 200, description: 'OTP verificado' })
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<ApiResponseDto<VerifyOtpResponseDto>> {
    const result = await this.authService.verifyOtp(dto);
    return ApiResponseDto.ok(result, result.valid ? 'OTP válido' : 'OTP inválido o expirado');
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con OTP' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente' })
  @ApiResponse({ status: 400, description: 'OTP inválido o expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<ApiResponseDto<null>> {
    await this.authService.resetPassword(dto);
    return ApiResponseDto.ok(null, 'Contraseña restablecida exitosamente');
  }
}
