import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService) => ({
  secret: configService.get<string>('PRIVATE_KEY', 'fallback-secret'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '124h'),
  },
});
