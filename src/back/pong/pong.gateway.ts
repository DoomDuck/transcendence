import {
  SubscribeMessage,
  WebSocketGateway,
  type OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { GameManagerService } from "./game-manager.service";

@WebSocketGateway({ namespace: "/pong" })
export class PongGateway implements OnGatewayConnection {
  constructor(private manager: GameManagerService) {}

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger("PongGateway");

  handleConnection(client: Socket) {
    this.logger.log(`connection ${client.id}`);
    this.manager.add(client);
  }
}
