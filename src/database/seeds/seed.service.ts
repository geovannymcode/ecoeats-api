import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../modules/auth/entities/user.entity';
import { DishEntity } from '../../modules/dishes/entities/dish.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedUsers();
    await this.seedDishes();
  }

  private async seedUsers(): Promise<void> {
    const count = await this.userRepository.count();
    if (count > 0) return;

    const hashedPassword = await bcrypt.hash('123456', 10);
    await this.userRepository.save({
      numeroDocumento: '00000000',
      nombres: 'Admin',
      apellidos: 'EcoEats',
      email: 'admin@ecoeats.com',
      password: hashedPassword,
      tokenFirebaseAuth: '',
    });

    this.logger.log('Seed: Usuario admin@ecoeats.com creado');
  }

  private async seedDishes(): Promise<void> {
    const count = await this.dishRepository.count();
    if (count > 0) return;

    const dishes: Partial<DishEntity>[] = [
      {
        name: 'Bandeja Paisa',
        description:
          'El plato más emblemático de la región antioqueña. Una generosa bandeja con frijoles rojos, arroz blanco, chicharrón crujiente, carne molida, chorizo, huevo frito, plátano maduro, arepa y aguacate.',
        image: 'https://images.unsplash.com/photo-1599655722738-ae7a40b0b994?w=600',
        thumbails: 'https://images.unsplash.com/photo-1599655722738-ae7a40b0b994?w=200',
        price: 28000,
        carbohydrates: 85,
        proteins: 55,
        rating: 4.9,
        ingredients:
          'Frijoles rojos, arroz blanco, chicharrón, carne molida, chorizo, huevo frito, plátano maduro, arepa, aguacate',
        flagHeader: true,
      },
      {
        name: 'Ajiaco Santafereño',
        description:
          'Sopa tradicional bogotana preparada con tres variedades de papa (criolla, pastusa y sabanera), pollo desmechado, mazorca y guascas. Se sirve con alcaparras, crema de leche y aguacate.',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600',
        thumbails: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200',
        price: 22000,
        carbohydrates: 50,
        proteins: 35,
        rating: 4.8,
        ingredients:
          'Papa criolla, papa pastusa, papa sabanera, pollo, mazorca, guascas, alcaparras, crema de leche, aguacate',
        flagHeader: true,
      },
      {
        name: 'Sancocho de Gallina',
        description:
          'El plato que une a las familias colombianas. Un caldo sustancioso con gallina criolla, yuca, plátano verde, papa, mazorca y cilantro. Típico de los domingos en la Costa Caribe y el Valle del Cauca.',
        image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600',
        thumbails: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=200',
        price: 20000,
        carbohydrates: 55,
        proteins: 40,
        rating: 4.7,
        ingredients:
          'Gallina criolla, yuca, plátano verde, papa, mazorca, cilantro, cebollín, ajo, comino',
        flagHeader: true,
      },
      {
        name: 'Arepa de Huevo',
        description:
          'Icono de la gastronomía costeña, especialmente de Luruaco y Cartagena. Arepa de maíz frita rellena de huevo, crujiente por fuera y suave por dentro. Se acompaña con suero costeño.',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600',
        thumbails: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200',
        price: 5000,
        carbohydrates: 35,
        proteins: 12,
        rating: 4.6,
        ingredients: 'Maíz amarillo, huevo, sal, aceite, suero costeño',
        flagHeader: false,
      },
      {
        name: 'Lechona Tolimense',
        description:
          'Tradición del Tolima Grande. Cerdo entero relleno de arroz, arvejas amarillas y especias, horneado lentamente durante horas. Se sirve con arepa delgada.',
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600',
        thumbails: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200',
        price: 18000,
        carbohydrates: 45,
        proteins: 50,
        rating: 4.7,
        ingredients: 'Cerdo, arroz, arvejas amarillas, cebolla larga, ajo, comino, pimienta, arepa',
        flagHeader: false,
      },
      {
        name: 'Mojarra Frita',
        description:
          'Pescado entero frito hasta quedar dorado y crujiente. Un clásico de los ríos y costas colombianas. Se sirve con arroz de coco, patacones y ensalada.',
        image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600',
        thumbails: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=200',
        price: 25000,
        carbohydrates: 40,
        proteins: 45,
        rating: 4.5,
        ingredients: 'Mojarra, arroz de coco, plátano verde (patacones), limón, ensalada, ajo',
        flagHeader: false,
      },
      {
        name: 'Empanadas Colombianas',
        description:
          'Crujientes empanadas de masa de maíz rellenas de carne molida sazonada con hogao, papa y comino. Se acompañan con ají colombiano casero.',
        image: 'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?w=600',
        thumbails: 'https://images.unsplash.com/photo-1614735241165-6756e1df61ab?w=200',
        price: 3000,
        carbohydrates: 30,
        proteins: 15,
        rating: 4.6,
        ingredients: 'Maíz, carne molida, papa, hogao (tomate, cebolla), comino, ají',
        flagHeader: false,
      },
      {
        name: 'Cazuela de Frijoles',
        description:
          'Frijoles rojos cocinados a fuego lento con garra de cerdo, plátano maduro y chicharrón desmenuzado. Se sirve con arroz blanco y aguacate. Muy popular en Antioquia y el Eje Cafetero.',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600',
        thumbails: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=200',
        price: 16000,
        carbohydrates: 55,
        proteins: 30,
        rating: 4.4,
        ingredients:
          'Frijoles rojos, garra de cerdo, plátano maduro, chicharrón, zanahoria, hogao, arroz blanco, aguacate',
        flagHeader: false,
      },
      {
        name: 'Tamal Colombiano',
        description:
          'Masa de maíz rellena de pollo, cerdo, zanahoria, arvejas, huevo y arroz, envuelta en hojas de plátano y cocida al vapor. Cada región tiene su propia versión.',
        image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=600',
        thumbails: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=200',
        price: 8000,
        carbohydrates: 50,
        proteins: 25,
        rating: 4.5,
        ingredients:
          'Masa de maíz, pollo, cerdo, zanahoria, arvejas, huevo duro, arroz, hojas de plátano',
        flagHeader: true,
      },
      {
        name: 'Ceviche de Camarón Cartagenero',
        description:
          'Camarones frescos marinados en limón con cebolla morada, tomate, cilantro y un toque de salsa rosada. Servido con galletas de soda. Muy popular en la Costa Caribe.',
        image: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600',
        thumbails: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=200',
        price: 20000,
        carbohydrates: 15,
        proteins: 28,
        rating: 4.6,
        ingredients:
          'Camarón, limón, cebolla morada, tomate, cilantro, salsa rosada, salsa negra, galletas de soda',
        flagHeader: false,
      },
      {
        name: 'Arroz Atollado Valluno',
        description:
          'Arroz cremoso y caldoso típico del Valle del Cauca, preparado con costilla de cerdo, pollo, longaniza, papa, hogao y aliños criollos.',
        image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=600',
        thumbails: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=200',
        price: 19000,
        carbohydrates: 60,
        proteins: 35,
        rating: 4.5,
        ingredients:
          'Arroz, costilla de cerdo, pollo, longaniza, papa criolla, hogao, cilantro, comino, color',
        flagHeader: false,
      },
      {
        name: 'Changua',
        description:
          'Caldo boyacense de desayuno preparado con leche, agua, huevos escalfados, cebolla larga y cilantro. Se sirve con pan duro o calado. Reconfortante en las mañanas frías del altiplano.',
        image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600',
        thumbails: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=200',
        price: 8000,
        carbohydrates: 20,
        proteins: 15,
        rating: 4.2,
        ingredients: 'Leche, agua, huevos, cebolla larga, cilantro, pan calado, sal',
        flagHeader: false,
      },
    ];

    await this.dishRepository.save(dishes);
    this.logger.log(`Seed: ${dishes.length} platos colombianos creados`);
  }
}
