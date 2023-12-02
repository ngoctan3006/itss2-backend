import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV_KEY } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const prefix = configService.get<string>(ENV_KEY.PREFIX);
  const port = configService.get<number>(ENV_KEY.PORT);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix(prefix);
  app.enableCors({ origin: '*' });

  await app.listen(port || 3000);
}
bootstrap();
