import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getByCategoryId(categoryId: string) {
    const category = this.prisma.category.findMany({
      where: { storeId: categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async getById(categoryId: string) {
    const category = this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async create(storeId: string, dto: CategoryDto) {
    const newCategory = await this.prisma.category.create({
      data: {
        ...dto,
        storeId,
      },
    });

    if (!newCategory) throw new Error('Failed to create category');

    return newCategory;
  }

  async update(categoryId: string, dto: CategoryDto) {
    await this.getById(categoryId);

    const updatedCategory = await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        ...dto,
      },
    });

    if (!updatedCategory) throw new Error('Failed to update category');

    return updatedCategory;
  }

  async delete(categoryId: string) {
    await this.getById(categoryId);

    const deletedCategory = await this.prisma.category.delete({
      where: { id: categoryId },
    });

    if (!deletedCategory) throw new Error('Failed to delete category');

    return deletedCategory;
  }
}
