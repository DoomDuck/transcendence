import type { Id } from "./general"

export type ChatUserDto = {
  id: Id,
  name: string,
  image: string,
  profile: ChatProfileDto
}

export type ChatProfileDto = {
  ranking: number,
  matchHistory: ChatMatchOutcomeDto[],
}

export type ChatMatchOutcomeDto = {
  opponent: Id,
  winner: boolean
}
