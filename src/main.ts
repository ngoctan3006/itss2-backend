import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV_KEY } from './common/constants';
import { setupSwagger } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('Main');

  const prefix = configService.get<string>(ENV_KEY.PREFIX);
  const port = configService.get<number>(ENV_KEY.PORT);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix(prefix);
  app.enableCors({ origin: '*' });

  setupSwagger(app, configService);

  await app.listen(port);
  logger.log(`🚀🚀🚀 Server is running on ${await app.getUrl()}`);
}
bootstrap();
