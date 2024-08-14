import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    if (searchTerm) return this.getSearchtermFilter(searchTerm);

    return await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        reviews: true,
        color: true,
      },
    });
  }

  private getSearchtermFilter(searchTerm: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
    });
  }

  async getByStoreId(storeId: string) {
    const product = this.prisma.product.findMany({
      where: { storeId },
      include: {
        category: true,
        color: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getById(productId: string) {
    const product = this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getByCategory(categoryId: string) {
    const products = this.prisma.product.findMany({
      where: { id: categoryId },
      include: {
        category: true,
        color: true,
        reviews: true,
      },
    });

    if (!products) throw new NotFoundException('Product not found');

    return products;
  }

  async getMostPopular() {
    const mostPopularProducts = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: { id: 'desc' },
      },
    });

    const productIds = mostPopularProducts
      .map((product) => product.productId)
      .filter((id) => id !== null);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });

    return products;
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);

    if (currentProduct === null || !currentProduct.category)
      throw new NotFoundException('Product not found');

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct.category.title,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });

    return products;
  }

  async create(storeId: string, dto: ProductDto) {
    const newColor = await this.prisma.product.create({
      data: {
        ...dto,
        storeId,
      },
    });

    if (!newColor) throw new Error('Failed to create product');

    return newColor;
  }

  async update(productId: string, dto: ProductDto) {
    await this.getById(productId);

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...dto,
      },
    });

    if (!updatedProduct) throw new Error('Failed to update product');

    return updatedProduct;
  }

  async delete(productId: string) {
    await this.getById(productId);

    const deletedProduct = await this.prisma.product.delete({
      where: { id: productId },
    });

    if (!deletedProduct) throw new Error('Failed to delete product');

    return deletedProduct;
  }
}
