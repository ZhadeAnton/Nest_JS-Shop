import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(@Query('searchTerm') searchTerm?: string) {
    return this.productService.getAll(searchTerm);
  }

  @Auth()
  @Get('by-store/:storeId')
  async getByStoreId(@Param('storeId') storeId: string) {
    return this.productService.getByStoreId(storeId);
  }

  @Auth()
  async getById(@Param('productId') productId: string) {
    return this.productService.getById(productId);
  }

  @Get('by-category/:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategory(categoryId);
  }

  @Get('most-popular')
  async getMostPopularProducts() {
    return this.productService.getMostPopular();
  }

  @Get('similar/:productId')
  async getSimilarProduct(@Param('productId') productId: string) {
    return this.productService.getSimilar(productId);
  }

  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async createProduct(
    @Param('storeId') storeId: string,
    @Body() dto: ProductDto,
  ) {
    return this.productService.create(storeId, dto);
  }

  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Auth()
  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() dto: ProductDto,
  ) {
    return this.productService.update(productId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    return this.productService.delete(productId);
  }
}
