import { Injectable } from "@nestjs/common";
import { channelDto } from "./channel.dto";

export class channel {
  constructor(
    _name: string,
    _priv: boolean,
    _protect: boolean,
    _password: string,
    creator: string
  ) {
    this.name = _name;
    this.priv = _priv;
    this.protect = _protect;
    this.password = _password;
    this.admin.push(creator);
  }
  name: string;
  type: string;
  // a modifie suivant la gestion du changement de pseudo;
  banned: string[];
  priv: boolean;
  protect: boolean;
  password: string;
  // a modifie suivant la gestion du changement de pseudo;
  admin: string[];
}
@Injectable()
export class ChannelManagerService {
  private array_channel: channel[];

  create_chan(channeldto: channelDto): boolean {
    const found = this.array_channel.find(
      (channel) => channel.name === channeldto.name
    );
    if (found === undefined) {
      this.array_channel.push(
        new channel(
          channeldto.name,
          channeldto.priv,
          channeldto.protec,
          channeldto.password,
          channeldto.creator
        )
      );
      return true;
    } else return false;
  }
}
