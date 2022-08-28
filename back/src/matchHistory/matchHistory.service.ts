import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { User } from '../user/entities/user.entity';
import { ServerSocket as Socket } from 'backFrontCommon';

import { RequestFeedbackDto, MatchInfoFromServer } from 'backFrontCommon';

import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}
  addOneMatch(player: User[], score: number[]) {
    this.matchRepository.save(new Match(player, score));
  }
  MatchDbToMatchDTO(match: Match): MatchInfoFromServer {
    if (match.score[0] > match.score[1])
      return {
        winner: match.player[0].id,
        looser: match.player[1].id,
        winnerScore: match.score[0],
        looserScore: match.score[1],
        date: match.date,
      };
    else
      return {
        winner: match.player[1].id,
        looser: match.player[0].id,
        winnerScore: match.score[1],
        looserScore: match.score[0],
        date: match.date,
      };
  }
  async getAllMatch(): Promise<RequestFeedbackDto<MatchInfoFromServer[]>> {
    let result: MatchInfoFromServer[] = [];
    const matchDb = await this.matchRepository.find();
    matchDb.forEach((match) => {
      result.push(this.MatchDbToMatchDTO(match));
    });
    return { success: true, result: result };
  }
}
