import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { UserEntity } from '../../modules/auth/entities/user.entity';
import { DishEntity } from '../../modules/dishes/entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DishEntity])],
  providers: [SeedService],
})
export class SeedModule {}
