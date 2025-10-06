import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Framework Laptop 13' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'Modular and DIY laptop',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
