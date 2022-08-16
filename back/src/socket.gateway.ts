import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import type {
  OnGatewayInit,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';

type Socket = IOSocketBaseType<ClientToServerEvents, ServerToClientEvents>;
type Server = IOServerBaseType<ClientToServerEvents, ServerToClientEvents>;

@WebSocketGateway({ cors: { origin: true } })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized penis');
  }
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    this.logger.log('socker gateway handle message');
    return { event: 'msgToClient', data: text };
  }
}
