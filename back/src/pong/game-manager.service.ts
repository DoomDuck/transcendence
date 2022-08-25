import { Injectable, Logger } from '@nestjs/common';
import { removeIfPresent } from 'pong';
import { ServerGameContext } from 'pong';
import {
  ChatError,
  ChatEvent,
  Id,
  GameAcceptToServer,
  GameRefuseToServer,
  ChatFeedbackDto,
} from 'backFrontCommon';
import { ServerSocket as Socket } from 'backFrontCommon';
import { GameInviteToServer } from 'backFrontCommon';
import { ActiveUser, UserService } from '../user/user.service';
import { GameCancelToServer } from 'backFrontCommon';

/* eslint-disable */

type PendingGameInvite = {
  sourceSocket: Socket;
  sourceId: Id;
  target: ActiveUser;
  classic: boolean;
};

// DEBUG
function invitsToString(invits: PendingGameInvite[]) {
  return (
    '[' +
    invits
      .map(
        (invite) => `{source: ${invite.sourceId}, target: ${invite.target.id}}`,
      )
      .join(', ') +
    ']'
  );
}
//

@Injectable()
export class GameManagerService {
  private matchQueueClassic: Socket[] = [];
  private matchQueueCustom: Socket[] = [];
  private pendingGameInvits: PendingGameInvite[] = [];
  private games: ServerGameContext[] = [];
  private logger: Logger = new Logger('GameManagerService');

  constructor(private userService: UserService) {}

  addMatchmaking(socket: Socket, classic: boolean) {
    if (classic)
      this.addSocketToMatchQueue(this.matchQueueClassic, socket, true);
    else this.addSocketToMatchQueue(this.matchQueueCustom, socket, false);
    socket.on('disconnect', () => {
      removeIfPresent(this.matchQueueClassic, socket);
    });
  }

  addObserver(socket: Socket, gameId: number) {
    this.games[0].addObserver(socket);
  }

  addSocketToMatchQueue(
    matchQueue: Socket[],
    socket: Socket,
    classic: boolean,
  ) {
    matchQueue.push(socket);
    if (matchQueue.length >= 2) {
      this.logger.log('two clients are waiting for a game');
      this.startGame([matchQueue[0], matchQueue[1]], classic);
      matchQueue.splice(0, 2);
    }
  }

  startGame(players: [Socket, Socket], classic: boolean) {
    if (Math.random() > 0.5) players = [players[1], players[0]];
    const gameInstance: ServerGameContext = new ServerGameContext(
      players,
      classic,
      () => removeIfPresent(this.games, gameInstance),
    );
    this.games.push(gameInstance);
    for (let i = 0; i < 2; i++) {
      players[i].emit(ChatEvent.GOTO_GAME_SCREEN, classic, () => {
        players[i].emit(ChatEvent.PLAYER_ID_CONFIRMED, i, () => {
          this.logger.log(`player ${i} ready`);
          gameInstance.isReady(i);
        });
      });
    }
  }

  handleGameInvite(sourceSocket: Socket, dto: GameInviteToServer) {
    const source = this.userService.findOneActiveBySocket(sourceSocket)!;
    const target = this.userService.findOneActive(dto.target);
    if (target === undefined) {
      return {
        success: false,
        errorMessage: ChatError.USER_OFFLINE,
      };
    }
    this.addPendingGameInvite(sourceSocket, source.id, target, dto.classic);
    target.emitOnAllSockets(ChatEvent.GAME_INVITE, {
      source: source.id,
      classic: dto.classic,
    });

    // this.logger.log(`After handleGameInvite, pending invits = ${invitsToString(this.pendingGameInvits)}`);
    return { success: true };
  }

  // GAME_ACCEPT
  handleGameAccept(
    targetSocket: Socket,
    dto: GameAcceptToServer,
  ): ChatFeedbackDto {
    const gameInvite = this.handleGameResponse(targetSocket, dto.target);
    // this.logger.log(`After handleGameResponse, pending invits = ${invitsToString(this.pendingGameInvits)}`);
    if (gameInvite === undefined) {
      return {
        success: false,
        errorMessage: ChatError.NO_SUCH_GAME_INVITATION,
      };
    }
    gameInvite.sourceSocket.emit(ChatEvent.GAME_ACCEPT, {
      source: gameInvite.target.id,
    });
    this.startGame([gameInvite.sourceSocket, targetSocket], gameInvite.classic);
    return { success: true };
  }

  // GAME_REFUSE
  handleGameRefuse(targetSocket: Socket, dto: GameRefuseToServer) {
    const gameInvite = this.handleGameResponse(targetSocket, dto.target);
    // this.logger.log(`After handleGameResponse, pending invits = ${invitsToString(this.pendingGameInvits)}`);
    if (gameInvite === undefined) return;
    gameInvite.sourceSocket.emit(ChatEvent.GAME_REFUSE, {
      source: gameInvite.target.id,
      reason: dto?.reason,
    });
  }

  // GAME_CANCEL
  handleGameCancel(sourceSocket: Socket, dto: GameCancelToServer) {
    const i = this.pendingGameInvits.findIndex(
      (gameInvite: PendingGameInvite) =>
        gameInvite.sourceSocket.id == sourceSocket.id &&
        gameInvite.target.id == dto.target,
    );
    if (i == -1) return;
    const gameInvite = this.pendingGameInvits[i];
    this.pendingGameInvits.splice(i, 1);
    gameInvite.target.emitOnAllSockets(ChatEvent.GAME_CANCEL, {
      source: gameInvite.sourceId,
      reason: dto?.reason,
    });
  }

  private handleGameResponse(
    targetSocket: Socket,
    sourceId: Id,
  ): PendingGameInvite | undefined {
    const _target = this.userService.findOneActiveBySocket(targetSocket)!;
    const _source = this.userService.findOneActive(sourceId);

    const target = this.userService.findOneActiveBySocket(targetSocket)!;
    const gameInvite = this.findAndRemovePendingGameInvite(sourceId, target.id);
    if (!gameInvite) {
      // Somebody accepted w/o having been invited
      return undefined;
    }
    // DELETE ALL FROM SOURCE TO TARGET's OTHER SOCKETAS
    target.socketUser
      .filter((_) => _ != targetSocket)
      .forEach((socket) =>
        socket.emit(ChatEvent.DELETE_GAME_INVITE, { target: sourceId }),
      );
    return gameInvite;
  }

  addPendingGameInvite(
    sourceSocket: Socket,
    sourceId: Id,
    target: ActiveUser,
    classic: boolean,
  ) {
    sourceSocket.on('disconnect', () => {
      target.emitOnAllSockets(ChatEvent.GAME_CANCEL, {
        source: sourceId,
        reason: ChatError.USER_OFFLINE,
      });
      this.removeBySourceId(sourceId);
    });
    target.eventEmitter.on('disconnect', () => {
      sourceSocket.emit(ChatEvent.GAME_REFUSE, {
        source: target.id,
        reason: ChatError.USER_OFFLINE,
      });
      this.removeByTargetId(target.id);
    });
    this.pendingGameInvits.push({
      sourceSocket,
      sourceId,
      target,
      classic,
    });
  }

  findAndRemovePendingGameInvite(
    sourceId: Id,
    targetId: Id,
  ): PendingGameInvite | undefined {
    const i = this.pendingGameInvits.findIndex(
      (gameInvite: PendingGameInvite) => {
        // console.log(`${gameInvite.sourceId} == ${sourceId} && ${gameInvite.target.id} == ${targetId}`);
        return (
          gameInvite.sourceId == sourceId && gameInvite.target.id == targetId
        );
      },
    );
    if (i == -1) return undefined;
    const gameInvite = this.pendingGameInvits[i];
    this.pendingGameInvits.splice(i, 1);
    return gameInvite;
  }

  removeBySourceId(id: Id) {
    this.pendingGameInvits = this.pendingGameInvits.filter(
      (invite) => invite.sourceId != id,
    );
  }

  removeByTargetId(id: Id) {
    this.pendingGameInvits = this.pendingGameInvits.filter(
      (invite) => invite.target.id != id,
    );
  }
}
