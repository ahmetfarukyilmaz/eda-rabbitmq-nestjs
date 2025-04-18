import { Controller, Logger } from '@nestjs/common';
import { OrderService } from './order-service.service';
import { CreateOrderDto } from '@app/common';
import {
  RabbitPayload,
  RabbitSubscribe,
  RabbitRequest,
} from '@golevelup/nestjs-rabbitmq';
import { IRabbitRequest } from '@app/common/interfaces';
import { getRequestIdFromRabbitMQ } from '@app/common/request-id';

@Controller()
export class OrderServiceController {
  private readonly logger = new Logger(OrderServiceController.name);

  constructor(private readonly orderService: OrderService) {}

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.order.placed',
    queue: 'order',
  })
  async handleOrderPlacedEvent(
    @RabbitPayload() orderData: CreateOrderDto,
    @RabbitRequest() request: IRabbitRequest,
  ): Promise<void> {
    const requestId = getRequestIdFromRabbitMQ(request.properties.headers);
    this.logger.log(`Processing order (requestId: ${requestId})`);
    await this.orderService.createOrder(orderData, requestId);
  }
}
