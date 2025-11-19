import { IsNumber, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsNumber()
  storeId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
