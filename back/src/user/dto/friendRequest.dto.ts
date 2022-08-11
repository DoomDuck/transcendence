import { Id } from '../../customType';
export class FriendRequestDto {
  constructor(public sender: Id, public target: Id) {
    this.sender = sender;
    this.target = target;
  }
}
