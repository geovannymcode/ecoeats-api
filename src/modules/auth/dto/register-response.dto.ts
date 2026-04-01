import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: '12345678' })
  readonly numero_documento: string;

  @ApiProperty({ example: 'Geovanny' })
  readonly nombres: string;

  @ApiProperty({ example: 'Mendoza' })
  readonly apellidos: string;

  @ApiProperty({ example: 'geovanny@example.com' })
  readonly correo: string;
}

export class RegisterResponseDto {
  @ApiProperty({ type: RegisterUserDto })
  readonly user: RegisterUserDto;
}
