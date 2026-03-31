import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: 'admin@ecoeats.com' })
  readonly email: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiJ9...' })
  readonly token: string;

  @ApiProperty({ example: '' })
  readonly tokenFirebaseAuth: string;
}
