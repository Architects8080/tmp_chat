import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, 'ft') {
  constructor(private http: HttpService, configService: ConfigService) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?client_id=${configService.get<string>(
        'ft.id',
      )}&redirect_uri=${configService.get<string>(
        'ft.callback',
      )}&response_type=code`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      scope: 'profile',
      clientID: configService.get<string>('ft.id'),
      clientSecret: configService.get<string>('ft.secret'),
      callbackURL: configService.get<string>('ft.callback'),
    });
  }

  async validate(accessToken: string): Promise<any> {
    const req = this.http.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    try {
      const { data } = await lastValueFrom(req);
      if (!data) throw new UnauthorizedException();
      return data;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
