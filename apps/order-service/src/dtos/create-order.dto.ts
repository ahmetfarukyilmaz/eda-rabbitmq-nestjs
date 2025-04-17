import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ description: 'The ID of the order item', example: 1 })
  @IsNumber()
  @Min(1)
  id: number;

  @ApiProperty({ description: 'The name of the product', example: 'Laptop' })
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @ApiProperty({ description: 'The quantity of the product', example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'The price of the product', example: 100 })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'The name of the customer', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @ApiProperty({
    description: 'The email of the customer',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  customer_email: string;

  @ApiProperty({
    description: 'The total amount of the order',
    example: 100,
  })
  @IsNumber()
  @Min(0)
  total_amount: number;

  @ApiProperty({
    description: 'The items in the order',
    type: () => OrderItemDto,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  order_items: OrderItemDto[];
}
