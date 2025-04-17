import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  await app.listen(Number(process.env.APP_PORT), () =>
    console.log(`Order Service is listening on port ${process.env.APP_PORT}`),
  );
}
bootstrap();
