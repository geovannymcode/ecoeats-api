import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DishesService } from './dishes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { DishResponseDto } from './dto/dish-response.dto';

@ApiTags('Dishes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get('dish')
  @ApiOperation({ summary: 'Obtener todos los platos' })
  @ApiResponse({ status: 200, description: 'Lista de platos colombianos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(): Promise<ApiResponseDto<DishResponseDto[]>> {
    const dishes = await this.dishesService.findAll();
    return ApiResponseDto.ok(dishes);
  }

  @Get('dish/:id')
  @ApiOperation({ summary: 'Obtener un plato por ID' })
  @ApiResponse({ status: 200, description: 'Plato encontrado' })
  @ApiResponse({ status: 404, description: 'Plato no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ApiResponseDto<DishResponseDto>> {
    const dish = await this.dishesService.findById(id);
    return ApiResponseDto.ok(dish);
  }
}
