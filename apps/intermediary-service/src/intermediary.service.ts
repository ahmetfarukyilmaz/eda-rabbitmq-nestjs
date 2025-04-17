import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'apps/order-service/src/dtos/create-order.dto';
import { InventoryItem } from './interfaces/inventory.interface';

@Injectable()
export class IntermediaryService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async CreateOrder(orderData: CreateOrderDto): Promise<string> {
    try {
      await this.amqpConnection.publish(
        'shop.topic',
        'shop.order.placed',
        orderData,
      );
      return 'Order successfully published.';
    } catch (error) {
      throw new Error(`Failed to publish order: ${error.message}`);
    }
  }

  async ListInventory(): Promise<InventoryItem[]> {
    try {
      const inventoryItems = await this.amqpConnection.request<InventoryItem[]>(
        {
          exchange: 'shop.direct',
          routingKey: 'shop.inventory.get',
          payload: {},
          timeout: 10000, // 10 seconds timeout
        },
      );

      return inventoryItems;
    } catch (error) {
      throw new Error(`Failed to retrieve inventory: ${error.message}`);
    }
  }
}
