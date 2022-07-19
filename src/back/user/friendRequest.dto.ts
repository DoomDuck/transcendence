import { idnumber } from "../customType";
export class FriendRequestDto {
  readonly sender: idnumber;
  readonly target: idnumber;
}
