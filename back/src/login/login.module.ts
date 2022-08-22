import { Module } from '@nestjs/common';
import { LoginGateway } from './login.gateway';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [LoginController],
  providers: [LoginService, LoginGateway],
})
export class LoginModule {}
