import { NestFactory } from '@nestjs/core';
import { LoggingServiceModule } from './logging-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LoggingServiceModule);
  await app.listen(Number(process.env.APP_PORT), () =>
    console.log(`Logging Service is listening on port ${process.env.APP_PORT}`),
  );
}
bootstrap();
