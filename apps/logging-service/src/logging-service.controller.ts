import { Controller, Logger } from '@nestjs/common';
import { LoggingService } from './logging-service.service';
import {
  RabbitPayload,
  RabbitRequest,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { IRabbitRequest } from '@app/common/interfaces';
import { EventLog } from './entities/event-log.entity';
import { getRequestIdFromRabbitMQ } from '@app/common/request-id';

@Controller()
export class LoggingServiceController {
  private readonly logger = new Logger(LoggingServiceController.name);

  constructor(private readonly loggingServiceService: LoggingService) {}

  @RabbitSubscribe({
    exchange: 'shop.topic',
    routingKey: 'shop.#',
    queue: 'logging',
  })
  async handleLog(
    @RabbitPayload() payload: any,
    @RabbitRequest() request: IRabbitRequest,
  ): Promise<void> {
    const { routingKey, exchange } = request.fields;
    const requestId = getRequestIdFromRabbitMQ(request.properties.headers);

    this.logger.log(`handleLog(): ${routingKey} (requestId: ${requestId})`);

    const eventLog = new EventLog();
    eventLog.routing_key = routingKey;
    eventLog.exchange = exchange;
    eventLog.payload = payload;
    eventLog.request_id = requestId;
    // TODO implement proper handlers for status and error
    eventLog.status = 'success';
    eventLog.error_message = '';

    this.loggingServiceService.createLog(eventLog);
  }
}
