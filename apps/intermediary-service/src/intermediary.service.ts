import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto, InventoryItemDto } from '@app/common';
import { createRabbitMQHeadersWithRequestId } from '@app/common/request-id';

@Injectable()
export class IntermediaryService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async CreateOrder(
    orderData: CreateOrderDto,
    requestId?: string,
  ): Promise<string> {
    try {
      await this.amqpConnection.publish(
        'shop.topic',
        'shop.order.placed',
        orderData,
        {
          headers: createRabbitMQHeadersWithRequestId(requestId),
        },
      );
      return 'Order successfully published.';
    } catch (error) {
      throw new Error(`Failed to publish order: ${error.message}`);
    }
  }

  async ListInventory(requestId?: string): Promise<InventoryItemDto[]> {
    try {
      const inventoryItems = await this.amqpConnection.request<
        InventoryItemDto[]
      >({
        exchange: 'shop.direct',
        routingKey: 'shop.inventory.get',
        payload: {},
        timeout: 10000, // 10 seconds timeout
        headers: createRabbitMQHeadersWithRequestId(requestId),
      });

      return inventoryItems;
    } catch (error) {
      throw new Error(`Failed to retrieve inventory: ${error.message}`);
    }
  }
}
