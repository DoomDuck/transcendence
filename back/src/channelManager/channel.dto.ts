import { Id } from '../customType';

export class ChannelDto {
  constructor(public name: string, public creator: Id) {
    this.name = name;
    this.creator = creator;
    this.password = name;
    this.priv = false;
    this.protec = false;
    this.admin = [];
    this.banned = [];
  }
  readonly password: string;
  readonly priv: boolean;
  readonly protec: boolean;
  readonly admin: Id[];
  readonly banned: Id[];
}
