import { Module } from '@nestjs/common';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryService } from './inventory-service.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { DatabaseModule } from '@app/common/database/database.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_INVENTORY_QUEUE: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        //POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        APP_PORT: Joi.number().required(),
      }),
      envFilePath: './apps/inventory-service/.env',
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
      enableControllerDiscovery: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Inventory]),
  ],
  controllers: [InventoryServiceController],
  providers: [InventoryService, InventoryServiceController],
})
export class InventoryServiceModule {}
