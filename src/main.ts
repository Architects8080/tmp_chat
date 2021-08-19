import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.use(
    cookieParser(),
    session({
      secret: 'this is secret',
      resave: false,
      saveUninitialized: true,
    }),
  );
  app.enableCors({
    origin: configService.get<string>('client_address'),
    credentials: true,
  }); // to resolve CORS problem
  await app.listen(5000);
}
bootstrap();
