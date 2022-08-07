import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { Channel } from '../channelManager/channelManager.service';
import { UserDto } from '../user/user.dto';
import { Id } from '../customType';
import { Socket, Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() wss!: Server;
  constructor(
    private userService: UserService,
    private channelManagerService: ChannelManagerService,
  ) {}
  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: any) {
    this.logger.log('Initialized chat ');
  }

  handleConnection(clientSocket: Socket) {
    this.logger.log(`Client connected: ${clientSocket.id}`);
    this.logger.log(clientSocket.handshake.auth.token);
    this.userService.addOne(
      new UserDto(
        clientSocket.handshake.auth.token,
        clientSocket.handshake.auth.token,
        clientSocket,
      ),
    );
  }

  //deprecated used to test on hugo.html
  @SubscribeMessage('chatToServer')
  handleMessage(message: { sender: string; message: string }) {
    this.logger.log('chat gateway handle message');
    this.wss.emit('chatToClient', message);
  }

  //Not sur if i'm gonna need client socket later
  @SubscribeMessage('userToChannel')
  handleMessageChannel(messageInfoChannel: {
    sender: Id;
    text: string;
    channelId: Id;
  }) {
    const tempChannel = this.channelManagerService.findChanById(
      messageInfoChannel.channelId,
    );
    if (tempChannel instanceof Channel) {
      tempChannel.member.forEach((member: Id) => {
        const tempUser = this.userService.findOneActive(member);
        if (tempUser)
          this.userService.updateChannelConversation(
            messageInfoChannel.channelId,
            member,
            tempChannel,
            messageInfoChannel.text,
          );
      });
      this.channelManagerService.sendMessageToChannel(
        this.wss,
        messageInfoChannel,
      );
    }
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(joinInfo: { sender: Id; channelId: Id }) {
    if (
      this.channelManagerService.joinChan(
        joinInfo.sender,
        joinInfo.channelId,
      ) === 'user added'
    )
      this.userService.joinChanUser(joinInfo.sender, joinInfo.channelId);
  }

  @SubscribeMessage('userToUser')
  handlePrivMessage(messageInfoPriv: { sender: Id; text: string; target: Id }) {
    this.userService.sendMessageToUser(this.wss, messageInfoPriv);
  }
}
