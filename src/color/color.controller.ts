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
import { ColorService } from './color.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ColorDto } from './dto/color.dto';

@Controller('colors')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Auth()
  @Get('by-storeId/:storeId')
  async getById(@Param('storeId') storeId: string) {
    return this.colorService.getById(storeId);
  }

  @UsePipes(ValidationPipe)
  @HttpCode(200)
  @Auth()
  @Post(':storeId')
  async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
    return this.colorService.create(storeId, dto);
  }

  @Auth()
  @HttpCode(200)
  @Put(':colorId')
  async update(@Param('colorId') colorId: string, @Body() dto: ColorDto) {
    return this.colorService.update(colorId, dto);
  }

  @Auth()
  @HttpCode(200)
  @Delete(':colorId')
  async delete(@Param('colorId') colorId: string) {
    return this.colorService.delete(colorId);
  }
}
