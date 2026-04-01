import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  readonly numero_documento: string;

  @ApiProperty({ example: 'Geovanny' })
  @IsString()
  @IsNotEmpty()
  readonly nombres: string;

  @ApiProperty({ example: 'Mendoza' })
  @IsString()
  @IsNotEmpty()
  readonly apellidos: string;

  @ApiProperty({ example: 'geovanny@example.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly correo: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
