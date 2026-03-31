import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { DishesRepository } from './dishes.repository';
import { DishEntity } from './entities/dish.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity]), AuthModule],
  controllers: [DishesController],
  providers: [DishesService, DishesRepository],
  exports: [DishesService],
})
export class DishesModule {}
