import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@ecoeats.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
