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
  @SubscribeMessage(ChatEvent.MSG_TO_CHANNEL)
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
      text: string;
    },
    reponseCallback: (chatFeedbackDto: ChatFeedbackDto) => void,
  ) {
    const feedback = this.userService.sendMessageToUser(
      clientSocket.handshake.auth.token,
      this.wss,
      messageInfo.text,
      messageInfo.target,
    );
    reponseCallback(feedback);
  }

  @SubscribeMessage(ChatEvent.FRIEND_INVITE)
  handleFriendInvite(friendRequest: { sender: Id; target: Id }) {
    const feedback = this.userService.addFriend(
      friendRequest.sender,
      friendRequest.target,
    );
  }
}
