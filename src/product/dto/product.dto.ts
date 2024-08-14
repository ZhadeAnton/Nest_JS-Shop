import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title must be provided' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description must be provided' })
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsNotEmpty({ message: 'Price must be provided' })
  price: number;

  @IsString({
    each: true,
    message: 'Color name must be a string',
  })
  @ArrayMinSize(1, { message: 'At least one image is required' })
  @IsNotEmpty({ each: true, message: 'Images are required' })
  images: string[];

  @IsString({
    message: 'Color name must be a string',
  })
  @IsNotEmpty({ message: 'Store is required' })
  storeId: string;
  categoryId: string;

  @IsString({
    message: 'Color name must be a string',
  })
  @IsNotEmpty({ message: 'Color is required' })
  colorId: string;
}
