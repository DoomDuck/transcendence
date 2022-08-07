import { ActiveConversation } from './user.service';

export class UserHistoryDto {
  constructor(
    public userHistory: ActiveConversation[],
    public channelHistory: ActiveConversation[],
  ) {}
}
