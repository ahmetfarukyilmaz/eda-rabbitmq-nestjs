import { Controller, Post, Body, HttpCode, Get, Req } from '@nestjs/common';
import { IntermediaryService } from './intermediary.service';
import { CreateOrderDto, InventoryItemDto } from '@app/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

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
  async CreateOrder(
    @Body() orderData: CreateOrderDto,
    @Req() request: Request,
  ): Promise<string> {
    return this.intermediaryService.CreateOrder(
      orderData,
      request['requestId'],
    );
  }

  @Get('/inventory')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiResponse({
    status: 200,
    description: 'List of all inventory items',
    type: InventoryItemDto,
    isArray: true,
  })
  async ListInventory(@Req() request: Request): Promise<InventoryItemDto[]> {
    const inventoryData = await this.intermediaryService.ListInventory(
      request['requestId'],
    );
    return inventoryData;
  }
}
