import type { Id } from "./general"
import type { MatchInfoFromServer } from "./chatEvents"

export type ChatUserDto = {
  id: Id,
  name: string,
  image: string,
  profile: ChatProfileDto
}

export type ChatProfileDto = {
  ranking: number,
  matchHistory: MatchInfoFromServer[],
}
//
// export type ChatMatchOutcomeDto = {
  // opponent: Id,
  // winner: boolean
// }
