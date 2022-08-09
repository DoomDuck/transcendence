import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
// import { Channel } from '../channelManager/channelManager.service';
import { ChatEvent } from 'chat';
import type { CreateChannelToServer, JoinChannelToServer } from 'chat';
import { ChatError } from 'chat';
import { UserDto } from '../user/user.dto';
import { ChatFeedbackDto } from './chatFeedback.dto';
import { Id } from '../customType';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents } from 'chat';

type Socket = IOSocketBaseType<ClientToServerEvents, ServerToClientEvents>;
type Server = IOServerBaseType<ClientToServerEvents, ServerToClientEvents>;
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
        parseInt(clientSocket.handshake.auth.token),
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

  @SubscribeMessage(ChatEvent.CREATE_CHANNEL)
  handleCreateChannel(clientSocket: Socket, chanInfo: CreateChannelToServer) {
    this.channelManagerService.createChan(
      clientSocket.handshake.auth.token,
      chanInfo,
    );
    this.logger.log(this.channelManagerService.findChanAll());
  }

  @SubscribeMessage(ChatEvent.MSG_TO_CHANNEL)
  async handleMessageChannel(
    clientSocket: Socket,
    dto: { target: string; content: string },
  ) {
    const tempChannel = await this.channelManagerService.findChanByName(
      dto.target,
    );
    const tempSender = this.userService.findOneActive(
      clientSocket.handshake.auth.token,
    );
    const feedback = this.channelManagerService.msgToChannelVerif(
      tempChannel,
      tempSender,
    );
    if (!feedback) return feedback;

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
    this.wss.to(tempChannel!.name).emit(ChatEvent.MSG_TO_CHANNEL, {
      source: tempSender!.name,
      channel: tempChannel!.name,
      content: dto.content,
    });
    return new ChatFeedbackDto(true);
  }

  @SubscribeMessage(ChatEvent.JOIN_CHANNEL)
  async handleJoinChannel(clientSocket: Socket, joinInfo: JoinChannelToServer) {
    let feedback: ChatFeedbackDto;
    if (!(await this.channelManagerService.findChanByName(joinInfo.channel))) {
      feedback = new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
      return;
    }
    if (!this.userService.findOneDb(clientSocket.handshake.auth.token)) {
      feedback = new ChatFeedbackDto(false, ChatError.U_DO_NOT_EXIST);
      return;
    }
    feedback = await this.channelManagerService.joinChan(
      clientSocket.handshake.auth.token,
      joinInfo.channel,
    );
    if (feedback.success === true)
      this.userService.joinChanUser(
        clientSocket.handshake.auth.token,
        joinInfo.channel,
      );
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
