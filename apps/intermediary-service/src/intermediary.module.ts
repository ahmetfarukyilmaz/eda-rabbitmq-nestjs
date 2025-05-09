import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { IntermediaryController } from './intermediary.controller';
import { IntermediaryService } from './intermediary.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as Joi from 'joi';
import { RequestIdMiddleware } from '@app/common/request-id';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_INTERMEDIARY_QUEUE: Joi.string().required(),
        APP_PORT: Joi.number().required(),
      }),
      envFilePath: './apps/intermediary-service/.env',
    }),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'shop.topic',
          type: 'topic',
        },
        {
          name: 'shop.direct',
          type: 'direct',
        },
      ],
      uri: process.env.RABBIT_MQ_URI,
    }),
  ],
  controllers: [IntermediaryController],
  providers: [IntermediaryService],
})
export class IntermediaryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
