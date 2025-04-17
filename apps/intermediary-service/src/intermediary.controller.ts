import { Controller, Post, Body, HttpCode, Get } from '@nestjs/common';
import { CreateOrderDto } from 'apps/order-service/src/dtos/create-order.dto';
import { IntermediaryService } from './intermediary.service';
import { InventoryItem } from './interfaces/inventory.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Intermediary')
@Controller('intermediary')
export class IntermediaryController {
  constructor(private readonly intermediaryService: IntermediaryService) {}

  @Post('/order')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 200,
    description: 'Order created successfully',
    type: String,
  })
  async CreateOrder(@Body() orderData: CreateOrderDto): Promise<string> {
    return this.intermediaryService.CreateOrder(orderData);
  }

  @Get('/inventory')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({
    status: 200,
    description: 'List of all inventory items',
    type: InventoryItem,
    isArray: true,
  })
  async ListInventory(): Promise<InventoryItem[]> {
    const inventoryData = await this.intermediaryService.ListInventory();
    return inventoryData;
  }
}
