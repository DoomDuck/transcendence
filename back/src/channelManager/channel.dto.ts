import { Id } from 'backFrontCommon';

export class ChannelDto {
  constructor(
    public name: string,
    public creator: Id,
    priv?: boolean,
    protec?: boolean,
  ) {
    this.password = name;
    if (priv) this.priv = priv;
    else this.priv = false;
    if (protec) this.protec = protec;
    else this.protec = false;
    this.admin = [];
    this.banned = [];
  }
  readonly priv: boolean;
  readonly protec: boolean;
  readonly password: string;
  readonly admin: Id[];
  readonly banned: Id[];
}
