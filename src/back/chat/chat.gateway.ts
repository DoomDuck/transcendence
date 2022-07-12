import {
  SubscribeMessage,
  WebSocketGateway,
  type OnGatewayInit,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({ namespace: "/chat" })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger("ChatGateway");
  afterInit(server: any) {
    this.logger.log("Initialized");
  }
  @SubscribeMessage("chatToServer")
  handleMessage(client: Socket, message: { sender: string; message: string }) {
    this.logger.log("chat gateway handle message");
    this.wss.emit("chatToClient", message);
  }
}
