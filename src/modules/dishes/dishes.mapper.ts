import { DishEntity } from './entities/dish.entity';
import { DishResponseDto } from './dto/dish-response.dto';

export class DishMapper {
  static toResponseDto(entity: DishEntity): DishResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      image: entity.image,
      thumbails: entity.thumbails,
      price: Number(entity.price),
      carbohydrates: entity.carbohydrates,
      proteins: entity.proteins,
      rating: Number(entity.rating),
      ingredients: entity.ingredients,
      flagHeader: entity.flagHeader,
    };
  }

  static toResponseDtoList(entities: DishEntity[]): DishResponseDto[] {
    return entities.map((entity) => DishMapper.toResponseDto(entity));
  }
}
