import { IsString } from 'class-validator';

export class CategoryDto {
  @IsString({
    message: 'Color name must be a string',
  })
  title: string;

  @IsString({
    message: 'Color value must be a string',
  })
  description: string;
}
