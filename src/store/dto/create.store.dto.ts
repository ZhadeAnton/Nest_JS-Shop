import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'Название магазина обязательно' })
  title: string;
}
