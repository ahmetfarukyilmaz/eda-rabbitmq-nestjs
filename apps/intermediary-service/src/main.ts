import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IntermediaryModule } from './intermediary.module';
import { ValidationPipe } from '@nestjs/common';
import { REQUEST_ID_HEADER } from '@app/common/request-id';

async function bootstrap() {
  const app = await NestFactory.create(IntermediaryModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Intermediary Service')
    .setDescription('Intermediary Service API')
    .setVersion('1.0')
    .addTag('intermediary')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: REQUEST_ID_HEADER },
      REQUEST_ID_HEADER,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(Number(process.env.APP_PORT), () =>
    console.log(
      `Intermediary Service is listening on port ${process.env.APP_PORT}`,
    ),
  );
}
bootstrap();
