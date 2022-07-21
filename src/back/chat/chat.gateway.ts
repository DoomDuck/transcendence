import{UserService} from '../user/user.service'
import{ChannelManagerService} from '../channelManager/channelManager.service'
import{UserDto} from '../user/user.dto'
import {Id} from '../customType'
import { Socket, Server } from "socket.io";
import {
OnGatewayConnection,
OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
   OnGatewayInit,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";

@WebSocketGateway({ namespace: "/chat" })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() wss: Server;
  constructor(
	  private userService: UserService,
	  private channelManagerService: ChannelManagerService,

  ) {}
  private logger: Logger = new Logger("ChatGateway");
  afterInit(server: any) {
    this.logger.log("Initialized chat ");
  }

  handleConnection(clientSocket: Socket) {
	this.logger.log(`Client connected: ${clientSocket.id}`);
	this.logger.log(clientSocket.handshake.auth.token);
	this.userService.addOneDb(new UserDto(1,clientSocket.handshake.auth.token,clientSocket.id));
}

  @SubscribeMessage("chatToServer")
  handleMessage(clientSocket: Socket, message: { sender: string; message: string }) {
    this.logger.log("chat gateway handle message");
    this.wss.emit("chatToClient", message);
  }
@SubscribeMessage("userToChannel")
  handleMessageChan(clientSocket: Socket, message: { sender: Id; text: string , channelId: Id}) {
	this.channelManagerService.sendMessageToChannel(this.wss,clientSocket,message.sender,message.text,message.channelId);
  }

@SubscribeMessage("joinChannel")
  handleJoinChannel(clientSocket: Socket, message: { sender: Id, channelId: Id}) {


  }

}
