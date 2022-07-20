import { Id } from "../customType";
export class FriendRequestDto {
  readonly sender: Id;
  readonly target: Id;
}
