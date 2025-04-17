import { ApiProperty } from '@nestjs/swagger';

export class InventoryItem {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the inventory item',
  })
  id: number;

  @ApiProperty({
    example: 'Product XYZ',
    description: 'The name of the product',
  })
  product_name: string;

  @ApiProperty({ example: 10, description: 'The quantity available in stock' })
  quantity: number;

  @ApiProperty({ example: 29.99, description: 'The price of the product' })
  price: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The creation timestamp',
  })
  created_at: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'The last update timestamp',
  })
  updated_at: string;
}
