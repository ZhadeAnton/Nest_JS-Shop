import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';

export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private configService: ConfigService) {
    super({
      clientId: configService.get('YANDEX_CLIENT_ID'),
      clientSecret: configService.get('YANDEX_CLIENT_SECRET'),
      callbackURL: configService.get('SERVER_URL') + '/auth/google/callback',
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
