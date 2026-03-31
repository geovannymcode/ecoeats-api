import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DishEntity } from './entities/dish.entity';

@Injectable()
export class DishesRepository {
  constructor(
    @InjectRepository(DishEntity)
    private readonly repository: Repository<DishEntity>,
  ) {}

  async findAll(): Promise<DishEntity[]> {
    return this.repository.find({ order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<DishEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async saveMany(dishes: Partial<DishEntity>[]): Promise<DishEntity[]> {
    const entities = this.repository.create(dishes);
    return this.repository.save(entities);
  }
}
