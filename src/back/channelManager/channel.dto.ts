import { Id } from "../customType";

export class ChannelDto {
  readonly name: string;
  readonly creator: Id;
  readonly password: string;
  readonly priv: boolean;
  readonly protec: boolean;
  readonly admin: Id[];
  readonly banned: Id[];
}
