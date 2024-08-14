import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get('by-storeId/:storeId')
  async getById(@Param('storeId') storeId: string) {
    return this.categoryService.getById(storeId);
  }

  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
    return this.categoryService.create(storeId, dto);
  }

  @Auth()
  @HttpCode(200)
  @Put(':categoryId')
  async update(
    @Param('categoryId') categoryId: string,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.update(categoryId, dto);
  }

  @Auth()
  @HttpCode(200)
  @Delete(':categoryId')
  async delete(@Param('categoryId') categoryId: string) {
    return this.categoryService.delete(categoryId);
  }
}
