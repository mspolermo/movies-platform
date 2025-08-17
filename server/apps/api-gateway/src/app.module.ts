import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET',
      signOptions: {
        expiresIn: '124h',
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
