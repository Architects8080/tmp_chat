import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

@Injectable()
export class AvatarConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    return {
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) cb(null, true);
        else cb(new BadRequestException('Unsupported Image Format'), false);
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = this.configService.get('public.avatar.path');
          if (!existsSync(path)) mkdirSync(path, { recursive: true });
          cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, randomUUID() + '.' + file.mimetype.split('/').pop());
        },
      }),
    };
  }
}
