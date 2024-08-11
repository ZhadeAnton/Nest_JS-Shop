import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  async getByStoreId(storeId: string) {
    const color = this.prisma.color.findMany({
      where: { storeId },
    });

    if (!color) throw new NotFoundException('Color not found');

    return color;
  }

  async getById(colorId: string) {
    const color = this.prisma.color.findUnique({
      where: { id: colorId },
    });

    if (!color) throw new NotFoundException('Color not found');

    return color;
  }

  async create(storeId: string, dto: ColorDto) {
    const newColor = await this.prisma.color.create({
      data: {
        name: dto.name,
        value: dto.value,
        storeId,
      },
    });

    if (!newColor) throw new Error('Failed to create color');

    return newColor;
  }

  async update(colorId: string, dto: ColorDto) {
    await this.getById(colorId);

    const updatedColor = await this.prisma.color.update({
      where: { id: colorId },
      data: {
        name: dto.name,
        value: dto.value,
      },
    });

    if (!updatedColor) throw new Error('Failed to update color');

    return updatedColor;
  }

  async delete(colorId: string) {
    await this.getById(colorId);

    const deletedColor = await this.prisma.color.delete({
      where: { id: colorId },
    });

    if (!deletedColor) throw new Error('Failed to delete color');

    return deletedColor;
  }
}
