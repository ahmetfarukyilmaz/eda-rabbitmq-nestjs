import { NestFactory } from '@nestjs/core';
import { IntermediaryModule } from './intermediary.module';

async function bootstrap() {
  const app = await NestFactory.create(IntermediaryModule);
  await app.listen(Number(process.env.APP_PORT), () =>
    console.log(
      `Intermediary Service is listening on port ${process.env.APP_PORT}`,
    ),
  );
}
bootstrap();
