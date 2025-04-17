import { NestFactory } from '@nestjs/core';
import { InventoryServiceModule } from './inventory-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  await app.listen(Number(process.env.APP_PORT), () =>
    console.log(
      `Inventory Service is listening on port ${process.env.APP_PORT}`,
    ),
  );
}
bootstrap();
