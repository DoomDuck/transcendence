import { Id } from 'backFrontCommon';
export class FriendRequestDto {
  constructor(public sender: Id, public target: Id) {
    this.sender = sender;
    this.target = target;
  }
}
