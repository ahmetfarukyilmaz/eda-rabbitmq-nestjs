import { Controller, Logger } from '@nestjs/common';
import { InventoryService } from './inventory-service.service';
import {
  RabbitPayload,
  RabbitRPC,
  RabbitRequest,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { IRabbitRequest, InventoryItemDto } from '@app/common';
import { Inventory } from './entities/inventory.entity';
import { getRequestIdFromRabbitMQ } from '@app/common/request-id';

@Controller()
export class InventoryServiceController {
  private readonly logger = new Logger(InventoryServiceController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.inventory.#',
    queue: 'inventory',
  })
  async handleInventory(
    @RabbitPayload()
    inventoryData: any,
    @RabbitRequest() request: IRabbitRequest,
  ): Promise<void> {
    const routingKey = request.fields.routingKey;
    const requestId = getRequestIdFromRabbitMQ(request.properties.headers);
    this.logger.log(
      `handleInventory(): ${routingKey} (requestId: ${requestId})`,
    );

    switch (routingKey) {
      case 'shop.inventory.create': {
        this.inventoryService.createInventory(inventoryData);
        break;
      }
      case 'shop.inventory.list': {
        // This functionality is now handled by RPC
        this.logger.log(
          'Deprecation notice: Please use RPC endpoint for inventory listing',
        );
        break;
      }
      case 'shop.inventory.update': {
        // TODO: Validate payload
        this.inventoryService.updateInventory(inventoryData);
        break;
      }
      case 'shop.inventory.delete': {
        // TODO: Validate payload
        this.inventoryService.removeFromInventory(inventoryData);
        break;
      }
      case 'shop.inventory.decrement.quantity': {
        // TODO: Validate payload
        this.inventoryService.decrementQuantity(inventoryData);
        break;
      }
      default: {
        this.logger.log(
          `There is no handler for message with routing key: ${routingKey}`,
        );
        break;
      }
    }
  }

  @RabbitRPC({
    exchange: 'shop.direct',
    routingKey: 'shop.inventory.check',
    queue: 'inventory-rpc-queue',
  })
  async handleCheckInventory(
    @RabbitPayload() inventoryData: Inventory[],
    @RabbitRequest() request: IRabbitRequest,
  ): Promise<boolean> {
    const requestId = getRequestIdFromRabbitMQ(request.properties.headers);
    this.logger.log(`Check inventory RPC (requestId: ${requestId})`);
    return this.inventoryService.checkInventory(inventoryData);
  }

  @RabbitRPC({
    exchange: 'shop.direct',
    routingKey: 'shop.inventory.get',
    queue: 'inventory-get-rpc-queue',
  })
  async handleGetInventory(
    @RabbitRequest() request: IRabbitRequest,
  ): Promise<InventoryItemDto[]> {
    const requestId = getRequestIdFromRabbitMQ(request.properties.headers);
    this.logger.log(
      `RPC request to get inventory items (requestId: ${requestId})`,
    );
    return this.inventoryService.listInventory();
  }
}
