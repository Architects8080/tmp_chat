import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketCorsAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  create(port: number, options: any = {}): any {
    options.cors = {
      origin: this.configService.get<string>('client_address'),
      credentials: true,
    };
    return super.create(port, options);
  }
}
