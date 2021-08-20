import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { SocketCorsAdapter } from './socket/socket-cors.adapter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.use(
    cookieParser(),
    session({
      secret: configService.get<string>('session.secret'),
      resave: false,
      saveUninitialized: true,
    }),
  );
  app.enableCors({
    origin: configService.get<string>('client_address'),
    credentials: true,
  }); // to resolve CORS problem
  app.useWebSocketAdapter(new SocketCorsAdapter(app, configService));
  await app.listen(5000);
}
bootstrap();
