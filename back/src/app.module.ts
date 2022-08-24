import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { UserModule } from './user/user.module';
import { GameManagerService } from './pong/game-manager.service';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login/login.module';
import { AppGateway } from './app.gateway';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), '../.env'),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(config),
    UserModule,
    LoginModule,
  ],
  controllers: [],
  providers: [GameManagerService, AppGateway],
})
export class AppModule {}
