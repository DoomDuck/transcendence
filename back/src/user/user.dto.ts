import { Id } from '../customType';
import { Socket } from 'socket.io';

export class UserDto {
  constructor(public id: Id, public name: string, public socket: Socket) {}
}
