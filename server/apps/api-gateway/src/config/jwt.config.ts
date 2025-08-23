import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET', 'fallback-secret'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '124h'),
  },
});
