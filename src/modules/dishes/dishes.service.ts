import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DishesRepository } from './dishes.repository';
import { DishResponseDto } from './dto/dish-response.dto';
import { DishMapper } from './dishes.mapper';

@Injectable()
export class DishesService {
  private readonly logger = new Logger(DishesService.name);

  constructor(private readonly dishesRepository: DishesRepository) {}

  async findAll(): Promise<DishResponseDto[]> {
    this.logger.log('Fetching all dishes');
    const dishes = await this.dishesRepository.findAll();
    return DishMapper.toResponseDtoList(dishes);
  }

  async findById(id: string): Promise<DishResponseDto> {
    this.logger.log(`Fetching dish: ${id}`);
    const dish = await this.dishesRepository.findById(id);

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return DishMapper.toResponseDto(dish);
  }
}
