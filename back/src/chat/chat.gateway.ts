import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { ChatEvent, ChatError, ChatFeedbackDto, LoginEvent } from 'backFrontCommon';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
import { Id } from 'backFrontCommon';
import { ConfigService } from '@nestjs/config';
import type {
  DMToServer,
  CreateChannelToServer,
  JoinChannelToServer,
} from 'backFrontCommon';
import { UserDto } from '../user/dto/user.dto';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
import fetch from 'node-fetch';

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
import { TOTP, Secret } from 'otpauth';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss!: Server;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private channelManagerService: ChannelManagerService,
  ) {}
  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: any) {
    this.logger.log('Initialized chat ');
  }

  // Random login for guest
  generateRandomId(): number {
    return Math.floor(Math.random() * 1_000);
  }

  async pass_totp_check(socket: Socket, totp: TOTP): Promise<boolean> {
    this.logger.debug("pass_totp_check");
    try {
      const token = await new Promise<string>(r => socket.once(LoginEvent.TOTP_CHECK, r));
      this.logger.debug("TOTP_CHECK");
      const delta = totp.validate({token});
      const success = delta === 0;
    
      this.logger.debug("validated");
      socket.emit(LoginEvent.TOTP_RESULT, success);
    
      this.logger.debug("finished");
      return success;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }
  
  async handleConnection(socket: Socket) {
    let code = socket.handshake.auth.code;
    this.logger.log(`Client connected: ${socket.id}`, code);

    // Guest login
    // TODO: Don't use random id
    if (!(typeof code == 'string')) {
      let id = this.generateRandomId();
      // TODO: Don't add guest to DB
      await this.userService.addOne(
        new UserDto(id, `guest-${id}`, socket),
      );
      return;
    }

    try {
      // Get 42 token
      const body = JSON.stringify({
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('PUBLIC_APP_42_ID'),
        client_secret: this.configService.get<string>('APP_42_SECRET'),
        code,
        redirect_uri: this.configService.get<string>('REDIRECT_URI'),
      });
      let response  = await fetch(`https://api.intra.42.fr/oauth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!response.ok) {
        throw new Error(`Could not fetch token: ${response.statusText}`);
      }
      let data = await response.json();
      if (!(typeof data == "object")) {
        throw new Error("Invalid body type");
      }
      const {access_token} = data;
      if (!(typeof access_token == "string")) {
        throw new Error("Could not extract token");
      }

      // Get user info
      const headers = { Authorization: 'Bearer ' + access_token };
      response = await fetch('https://api.intra.42.fr/v2/me/', { headers });
      if (!response.ok) {
        throw new Error(`Could not fetch user id: ${response.statusText}`);
      }
      data = await response.json();
      
      // Check user info
      if (!(typeof data == "object"))
        throw new Error("Invalid body type");
      const {id, login} = data;
      if (!(typeof id == "number" && typeof login == "string"))
        throw new Error(`Could not fetch id or login properly`);
      
      // Add user to server
      await this.userService.addOne(new UserDto(id, login, socket));

      // Check if user has 2fa setup
      const user = await this.userService.findOneDb(id);
      if (!user) throw new Error(`Could not find created user`);

      // TODO move to some config
      const TOTP_DESCRIPTION = {
        issuer: "Transcendance",
        label: "2fa",
      };

      // Check totp requirement
      const {totpSecret} = user;
      socket.emit(LoginEvent.TOTP_REQUIREMENTS, !!totpSecret);


      let totp : TOTP;
       // 2fa
      if (totpSecret) {
        totp = new TOTP({
          secret: Secret.fromHex(totpSecret),
          ...TOTP_DESCRIPTION
        });
      } else {
        // For now force TOTP setup
        // TODO: Move totp setup to settings
        await new Promise<void>(r => socket.once(LoginEvent.TOTP_DEMAND_SETUP, r));
        this.logger.debug("Creating new token");
        totp = new TOTP(TOTP_DESCRIPTION);
        socket.emit(LoginEvent.TOTP_SETUP, totp.toString());
        this.logger.debug("Sent token");
      }
      if (!this.pass_totp_check(socket, totp)) {
        socket.disconnect();
        return;
      }
      
      if (!totpSecret) {
        await this.userService.updateTotp(user, totp.secret.hex);
      }

      this.logger.log(`end handle connection`);
    } catch (e: any) {
      this.logger.log(`in connection fail `, e);
    }
  }

  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`Client connected: ${clientSocket.id}`);
    this.logger.log(clientSocket.handshake.auth.code);
    this.userService.disconnection(clientSocket);
  }

  @SubscribeMessage(ChatEvent.CREATE_CHANNEL)
  async handleCreateChannel(
    clientSocket: Socket,
    chanInfo: CreateChannelToServer,
  ) {
    const tempUser = this.userService.findOneActiveBySocket(clientSocket);

    if (!tempUser)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    const newChan = await this.channelManagerService.createChan(
      tempUser,
      chanInfo,
    );

    if (!newChan)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    this.channelManagerService.joinChan(tempUser, newChan);
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

    if (!tempChannel)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    const tempSender = this.userService.findOneActiveBySocket(clientSocket);
    if (!tempSender) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
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
          tempSender,
          tempUser,
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
    const tempUser = this.userService.findOneActiveBySocket(clientSocket);

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
      this.logger.log(`joining chanUSer `);
      this.userService.joinChanUser(tempUser, tempChan);
    }

    return feedback;
  }

  @SubscribeMessage(ChatEvent.MSG_TO_USER)
  handlePrivMessage(clientSocket: Socket, dm: DMToServer) {
    const sender = this.userService.findOneActiveBySocket(clientSocket);
    if (!sender) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    const target = this.userService.findOneActive(dm.target);
    if (!target) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.USER_NOT_FOUND,
      );
    }
    const feedback = this.userService.sendMessageToUser(
      sender,
      this.wss,
      dm.content,
      target,
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
