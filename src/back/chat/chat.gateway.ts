import { UserService } from "../user/user.service";
import { ChannelManagerService } from "../channelManager/channelManager.service";
import { UserDto } from "../user/user.dto";
import { Id } from "../customType";
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
    private channelManagerService: ChannelManagerService
  ) {}
  private logger: Logger = new Logger("ChatGateway");
  afterInit(server: any) {
    this.logger.log("Initialized chat ");
  }

  handleConnection(clientSocket: Socket) {
    this.logger.log(`Client connected: ${clientSocket.id}`);
    this.logger.log(clientSocket.handshake.auth.token);
    this.userService.addOne(
      new UserDto(
        clientSocket.handshake.auth.token,
        clientSocket.handshake.auth.token,
        clientSocket
      )
    );
  }

  //deprecated used to test on hugo.html
  @SubscribeMessage("chatToServer")
  handleMessage(message: { sender: string; message: string }) {
    this.logger.log("chat gateway handle message");
    this.wss.emit("chatToClient", message);
  }

  //Not sur if i'm gonna need client socket later
  @SubscribeMessage("userToChannel")
  handleMessageChannel(messageInfoChannel: {
    sender: Id;
    text: string;
    channelId: Id;
  }) {
    this.channelManagerService.sendMessageToChannel(
      this.wss,
      messageInfoChannel
    );
  }

  @SubscribeMessage("joinChannel")
  handleJoinChannel(
    clientSocket: Socket,
    joinInfo: { sender: Id; channelId: Id }
  ) {
    if (
      this.channelManagerService.joinChan(
        joinInfo.sender,
        joinInfo.channelId
      ) === "user added"
    )
      this.userService.joinChanUser(joinInfo.sender, joinInfo.channelId);
  }

  // @SubscribeMessage("userToChannel")
  //   handlePrivMessage(
  //     clientSocket: Socket,
  //     messageInfoPriv: { sender: Id; text: string; target: Id }
  //   ) {
  //     this.channelManagerService.sendMessageTo(
  //       this.wss,
  //       clientSocket,
  // 	  messageInfoPriv,

  //     );
  //   }
}
