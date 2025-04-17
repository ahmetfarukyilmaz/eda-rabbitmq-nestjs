import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

// Load env file
config({ path: join(__dirname, '.env') });

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  username: configService.getOrThrow('POSTGRES_USER'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  database: configService.getOrThrow('POSTGRES_DB'),
  migrations: [join(__dirname, 'migrations/**/*.ts')],
  entities: [join(__dirname, 'src/entities/**/*.entity.{ts,js}')],
});
