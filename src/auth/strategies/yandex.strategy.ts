import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('YANDEX_CLIENT_ID'),
      clientSecret: configService.get<string>('YANDEX_CLIENT_SECRET'),
      callbackURL:
        configService.get<string>('SERVER_URL') + '/auth/google/callback',
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: any,
  ) {
    const { username, emails, photos } = profile;

    if (!emails || !photos)
      return done(new Error('Google validation error'), false);

    const user = {
      name: username,
      email: emails[0].value,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
