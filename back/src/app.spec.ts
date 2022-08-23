// import {AppModule} from './app.module';
// import {UserService} from './user/user.service';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { UserModule } from './user/user.module';
import { PongGateway } from './pong/pong.gateway';
import { UserService } from './user/user.service';
import { UserDto } from './user/dto/user.dto';
import { GameManagerService } from './pong/game-manager.service';

describe('AppModule', () => {
  let appModule;
  let userService: UserService;

  beforeEach(async () => {
    appModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(config), UserModule],
      controllers: [],
      providers: [PongGateway, GameManagerService],
    }).compile();

    userService = appModule.get<UserService>(UserService);
  });
  describe('UserService', () => {
    it('isDefined', () => {
      expect(userService).toBeDefined();
    });
  });
  describe('UserService', () => {
    it('addOne', () => {
      const result = userService.addOne({
        id: 0,
        name: 'Patrick',
      } as UserDto);
    });
  });
});
