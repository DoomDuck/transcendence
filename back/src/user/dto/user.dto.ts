import { Id } from 'backfrontcommon';
import { Socket as IOSocketBaseType } from 'socket.io';

import { ServerToClientEvents, ClientToServerEvents } from 'backfrontcommon';

type Socket = IOSocketBaseType<ClientToServerEvents, ServerToClientEvents>;

export class UserDto {
  constructor(public id: Id, public name: string, public socket: Socket) {}
}
