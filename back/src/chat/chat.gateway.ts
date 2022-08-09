import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { Channel } from '../channelManager/channelManager.service';
import { ChatEvent } from 'chat';
import { ChatError } from 'chat';
import { UserDto } from '../user/user.dto';
import { ChatFeedbackDto } from './chatFeedback.dto';
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
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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
  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`Client connected: ${clientSocket.id}`);
    this.logger.log(clientSocket.handshake.auth.token);
    this.userService.disconnection(clientSocket);
  }
  //deprecated used to test on hugo.html
  @SubscribeMessage('chatToServer')
  handleMessage(message: { sender: string; message: string }) {
    this.logger.log('chat gateway handle message');
    this.wss.emit('chatToClient', message);
  }

  @SubscribeMessage(ChatEvent.CREATE_CHANNEL)
  handleCreateChannel() {}




  @SubscribeMessage(ChatEvent.MSG_TO_CHANNEL)
  handleMessageChannel(
    clientSocket: Socket,
    dto: { target: string; content: string },
  ) {
    const tempChannel = this.channelManagerService.findChanByName(dto.target);
	const tempSender = this.userService.findOneActive(
      clientSocket.handshake.auth.token,
    );
	const feedback = this.channelManagerService.msgToChannelVerif(tempChannel, tempSender);
	if(!feedback)
		return feedback;

    tempChannel!.member.forEach((member: Id) => {
      const tempUser = this.userService.findOneActive(member);
      if (tempUser)
        this.userService.updateChannelConversation(
          clientSocket.handshake.auth.token,
          member,
          tempChannel!,
          dto.content,
        );
    });
    this.wss
      .to(tempChannel!.name)
      .emit(ChatEvent.MSG_TO_CHANNEL, {
        source: tempSender!.name,
        channel: tempChannel!.name,
        content: dto.content,
      });
    return new ChatFeedbackDto(true);
  }

  @SubscribeMessage(ChatEvent.JOIN_CHANNEL)
  handleJoinChannel(joinInfo: { sender: Id; channelId: Id }) {
    let feedback: ChatFeedbackDto;
    if (!this.channelManagerService.findChanById(joinInfo.channelId)) {
      feedback = new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
      return;
    }
    if (!this.userService.findOneDb(joinInfo.sender)) {
      feedback = new ChatFeedbackDto(false, ChatError.USER_NOT_FOUND);
      return;
    }
    feedback = this.channelManagerService.joinChan(
      joinInfo.sender,
      joinInfo.channelId,
    );

    if (feedback.success === true)
      this.userService.joinChanUser(joinInfo.sender, joinInfo.channelId);
    return feedback;
  }

  @SubscribeMessage(ChatEvent.MSG_TO_USER)
  handlePrivMessage(
    clientSocket: Socket,
    messageInfo: {
      target: string;
      content: string;
    },
  ) {
    const feedback = this.userService.sendMessageToUser(
      clientSocket.handshake.auth.token,
      this.wss,
      messageInfo.content,
      messageInfo.target,
    );
    console.log(feedback);
    return feedback;
  }

  @SubscribeMessage(ChatEvent.FRIEND_INVITE)
  handleFriendInvite(friendRequest: { sender: Id; target: Id }) {
    const feedback = this.userService.addFriend(
      friendRequest.sender,
      friendRequest.target,
    );
	return feedback;
  }
}
