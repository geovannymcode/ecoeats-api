import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    this.logger.log(`Login attempt for: ${dto.email}`);

    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'password', 'tokenFirebaseAuth'],
    });

    if (!user) {
      this.logger.warn(`Login failed — user not found: ${dto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed — invalid password: ${dto.email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    this.logger.log(`Login successful: ${user.email}`);

    return {
      id: user.id,
      email: user.email,
      token,
      tokenFirebaseAuth: user.tokenFirebaseAuth,
    };
  }
}
