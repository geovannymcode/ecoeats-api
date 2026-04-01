import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@ecoeats.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  readonly otp: string;

  @ApiProperty({ example: 'NewSecurePass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly newPassword: string;
}
