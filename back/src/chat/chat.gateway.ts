import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { ChatEvent } from 'backFrontCommon';
import type {
  CreateChannelToServer,
  JoinChannelToServer,
} from 'backFrontCommon';
import { ChatError, ChatFeedbackDto } from 'backFrontCommon';
import { UserDto } from '../user/dto/user.dto';
import { Id } from 'backFrontCommon';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';

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
import { DMToServer } from 'backFrontCommon';

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

    this.logger.log(`end handle connection`);
  }
  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`Client connected: ${clientSocket.id}`);
    this.logger.log(clientSocket.handshake.auth.token);
    this.userService.disconnection(clientSocket);
  }

  @SubscribeMessage(ChatEvent.CREATE_CHANNEL)
  async handleCreateChannel(
    clientSocket: Socket,
    chanInfo: CreateChannelToServer,
  ) {
    const newChan = await this.channelManagerService.createChan(
      Number(clientSocket.handshake.auth.token),
      chanInfo,
    );

    if (!newChan)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    // this.logger.log('after create');
    // const entities = await this.channelManagerService.findChanAll();
    // entities.forEach((channel)=> console.log(channel.name))
    //need to change with auth integration
    this.channelManagerService.joinChan(
      clientSocket.handshake.auth.token,
      newChan,
    );
    return this.channelManagerService.newChatFeedbackDto(true);
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
      Number(clientSocket.handshake.auth.token),
    );

    const feedback = this.channelManagerService.msgToChannelVerif(
      tempChannel,
      tempSender,
    );
    if (!feedback) return feedback;
    this.logger.log(`sender: ${tempSender!.name}`);
    this.logger.log(`channel: ${tempChannel!.name}`);
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
    clientSocket.to(tempChannel!.name).emit(ChatEvent.MSG_TO_CHANNEL, {
      source: tempSender!.id,
      channel: tempChannel!.name,
      content: dto.content,
    });
    return this.channelManagerService.newChatFeedbackDto(true);
  }

  @SubscribeMessage(ChatEvent.JOIN_CHANNEL)
  async handleJoinChannel(clientSocket: Socket, joinInfo: JoinChannelToServer) {
    let feedback: ChatFeedbackDto;
    const tempChan = await this.channelManagerService.findChanByName(
      joinInfo.channel,
    );
    const tempUser = this.userService.findOneActive(
      Number(clientSocket.handshake.auth.token),
    );

    this.logger.log(`any joiner in the  chat ?${tempUser} `);
    if (!tempChan) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    }
    if (!tempUser) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    feedback = await this.channelManagerService.joinChan(tempUser, tempChan);
    if (feedback.success === true) {
      this.logger.log(`joingin chanUSer `);
      this.userService.joinChanUser(tempUser, tempChan);
    }

    return feedback;
  }

  @SubscribeMessage(ChatEvent.MSG_TO_USER)
  handlePrivMessage(clientSocket: Socket, messageInfo: DMToServer) {
    this.logger.log('ChatEvent.MSG_TO_USER:', JSON.stringify(messageInfo));
    const feedback = this.userService.sendMessageToUser(
      Number(clientSocket.handshake.auth.token),
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
