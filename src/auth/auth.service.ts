import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  EXPIRES_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByIEmail(dto.email);

    if (oldUser) throw new Error('Пользователь с таким email уже зарегист');

    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  issueTokens(userId: string) {
    const accessToken = this.jwt.sign({ id: userId }, { expiresIn: '1h' });
    const refreshToken = this.jwt.sign({ id: userId }, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync<{ id: string }>(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    if (!result) throw new UnauthorizedException('Невалидный refresh токен');

    const user = await this.userService.getById(result.id);

    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByIEmail(dto.email);

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async validateOAuthLogin(req: any) {
    let user = await this.userService.getByIEmail(req.user.email);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture,
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });
    }

    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  addRefreshTokneToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRES_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
