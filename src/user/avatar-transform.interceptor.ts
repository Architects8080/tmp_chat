import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { User } from './entity/user.entity';

export class AvatarTransformInterceptor implements NestInterceptor {
  constructor(protected configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((obj: object) => {
        return this.transform(obj);
      }),
    );
  }

  transform(obj: object) {
    if (obj instanceof User) {
      obj.avatar = this.transformAvatarUrl(obj.avatar);
    } else if (Array.isArray(obj)) {
      obj.forEach((value) => {
        this.transform(value);
      });
    } else {
      const entries = Object.values(obj);
      entries.forEach((value) => {
        this.transform(value);
      });
    }
    return obj;
  }

  transformAvatarUrl(filename: string): string {
    if (filename == null) return '';
    if (!filename.match('^https?://')) {
      const route = this.configService.get<string>('public.route');
      const avatarRoute = this.configService.get<string>('public.avatar.route');
      return `http://localhost:5000${route}${avatarRoute}/${filename}`;
    }
    return filename;
  }
}
