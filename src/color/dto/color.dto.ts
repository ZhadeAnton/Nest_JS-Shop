import { IsString } from 'class-validator';

export class ColorDto {
  @IsString({
    message: 'Color name must be a string',
  })
  name: string;

  @IsString({
    message: 'Color value must be a string',
  })
  value: string;
}
