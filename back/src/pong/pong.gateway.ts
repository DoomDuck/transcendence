import {
  SubscribeMessage,
  WebSocketGateway,
  type OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { GameManagerService } from './game-manager.service';

@WebSocketGateway({ namespace: '/pong', cors: { origin: true } })
export class PongGateway implements OnGatewayConnection {
  constructor(private manager: GameManagerService) {}

  @WebSocketServer() wss!: Server;
  private logger: Logger = new Logger('PongGateway');

  handleConnection(client: Socket) {
    this.logger.log(`socket connection ${client.id}`);
    client.on('joinMatchMaking', () => {
      this.manager.add(client);
    });
    ///// TTTTTEEEMMMMPORARRRRRRRYYYY-YEAH
    client.on('observe', (gameId: number) => {
      this.manager.addObserver(client, gameId);
    });
  }
}
