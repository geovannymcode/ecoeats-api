import { ApiProperty } from '@nestjs/swagger';

export class DishResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  readonly id: string;

  @ApiProperty({ example: 'Bandeja Paisa' })
  readonly name: string;

  @ApiProperty({ example: 'El plato más representativo de la cocina antioqueña' })
  readonly description: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-bandeja.jpg' })
  readonly image: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-bandeja-thumb.jpg' })
  readonly thumbails: string;

  @ApiProperty({ example: 25 })
  readonly price: number;

  @ApiProperty({ example: 60 })
  readonly carbohydrates: number;

  @ApiProperty({ example: 40 })
  readonly proteins: number;

  @ApiProperty({ example: 4.8 })
  readonly rating: number;

  @ApiProperty({
    example: 'Frijoles, arroz, chicharrón, carne molida, huevo, plátano maduro, arepa, aguacate',
  })
  readonly ingredients: string;

  @ApiProperty({ example: true })
  readonly flagHeader: boolean;
}
