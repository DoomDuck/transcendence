import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';
// import { Observable } from 'rxjs';
// import { MessageMappingProperties } from '@nestjs/websockets';

export class SocketAdapter extends IoAdapter {
  logger = new Logger("SocketAdapter");

  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
  
  // bindMessageHandlers(socket: Socket, handlers: MessageMappingProperties[], transform: (data: any) => Observable<any>): void {
  //   this.logger.debug(transform);
  //   super.bindMessageHandlers(socket, handlers, transform);
  // }
  
  
}
