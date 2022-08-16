import { Injectable, Logger } from '@nestjs/common';
import { Match } from './match.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Id } from 'backFrontCommon';
@Injectable()
export class MatchHistoryService {
  constructor() {} // private matchRepository: Repository<Match>, // @InjectRepository(Match)
  // addOneMatch(player1:User, player2:User, player1score:number, player2score:number)
  // {
  // if (player1score >player2score)
  // this.matchRepository.save(new Match(player1,player2,player1score,player2score,player1))
  // else
  // this.matchRepository.save(new Match(player1,player2,player1score,player2score,player1))
  // }
}
