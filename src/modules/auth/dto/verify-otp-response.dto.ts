import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResponseDto {
  @ApiProperty({ example: true })
  readonly valid: boolean;
}
