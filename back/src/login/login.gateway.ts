import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { LoginEvent } from 'backFrontCommon';
import { UserDto } from '../user/dto/user.dto';
import { TOTP, Secret } from 'otpauth';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket as IOSocketBaseType } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
import { Logger } from '@nestjs/common';
import fetch from 'node-fetch';
type Socket = IOSocketBaseType<ClientToServerEvents, ServerToClientEvents>;

const TOTP_DESCRIPTION = {
  issuer: 'Transcendance',
  label: '2fa',
};

@WebSocketGateway({ namespace: '/login' })
export class LoginGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  private clientsRequiringTotp = new Map<
    Socket,
    { totp: TOTP; user: UserDto }
  >();

  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async fetchToken(code: string): Promise<string> {
    const body = JSON.stringify({
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('PUBLIC_APP_42_ID'),
      client_secret: this.configService.get<string>('APP_42_SECRET'),
      code,
      redirect_uri: this.configService.get<string>('REDIRECT_URI'),
    });
    const response = await fetch(`https://api.intra.42.fr/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (!response.ok) {
      throw new Error(`Could not fetch token: ${response.statusText}`);
    }
    let data = await response.json();
    if (!(typeof data == 'object')) {
      throw new Error('Invalid body type');
    }
    const { access_token } = data;
    if (!(typeof access_token == 'string')) {
      throw new Error('Could not extract token');
    }
    return access_token;
  }

  async fetchUserInfo(token: string): Promise<{ id: number; login: string }> {
    const response = await fetch('https://api.intra.42.fr/v2/me/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok)
      throw new Error(`Could not fetch user id: ${response.statusText}`);

    const data = await response.json();
    if (!(typeof data == 'object')) throw new Error('Invalid body type');

    const { id, login } = data;
    if (!(typeof id == 'number' && typeof login == 'string'))
      throw new Error(`Could not fetch id or login properly`);

    return { id, login };
  }

  async handleGuest(socket: Socket) {
    await this.userService.addOneGuest(socket);
  }

  @SubscribeMessage(LoginEvent.TOTP_DEMAND_SETUP)
  async onTotpDemandSetup(socket: Socket) {
    const totp = new TOTP(TOTP_DESCRIPTION);
    socket.emit(LoginEvent.TOTP_SETUP, totp.toString());

    // TODO

    // if (!totpSecret) {
    //     await this.userService.updateTotp(userInDb, totp.secret.hex);
    // }
  }

  @SubscribeMessage(LoginEvent.TOTP_CHECK)
  async onTotpCheck(socket: Socket, token: string) {
    const client = this.clientsRequiringTotp.get(socket)!;

    const delta = client.totp.validate({ token });
    const success = delta === 0;

    socket.emit(LoginEvent.TOTP_RESULT, success);
    if (!success) return;

    this.userService.addOne(client.user);
    this.clientsRequiringTotp.delete(socket);
  }

  async handleUser(socket: Socket, code: string) {
    const token = await this.fetchToken(code);

    const { id, login } = await this.fetchUserInfo(token);
    const user = new UserDto(id, login, socket);

    const userInDb = await this.userService.findOneDb(id);
    const totpSecret = userInDb ? userInDb.totpSecret : null;

    socket.emit(LoginEvent.TOTP_REQUIREMENTS, !!totpSecret);

    if (!totpSecret) {
      this.userService.addOne(user);
      return;
    }

    const totp = new TOTP({
      secret: Secret.fromHex(totpSecret),
      ...TOTP_DESCRIPTION,
    });
    this.clientsRequiringTotp.set(socket, { totp, user });
  }

  async handleConnection(socket: Socket) {
    let code = socket.handshake.auth.code;

    if (typeof code == 'string') {
      this.handleUser(socket, code);
    } else {
      this.handleGuest(socket);
    }
  }
}
