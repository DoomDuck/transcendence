import { SubscribeMessage, WebSocketGateway, type OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';

type VoidCallback = (...args: any[]) => void;

type GameSockets = {
    players: [Socket?, Socket?],
    playersReady: [boolean, boolean],
    playersSetBallCallbacks: [VoidCallback?, VoidCallback?];
    observers: Socket[],
};

@WebSocketGateway({ namespace: '/pong' })
export class PongGateway implements OnGatewayInit {

	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('PongGateway');
	private sockets: GameSockets = {
		players: [undefined, undefined],
		playersReady: [false, false],
		playersSetBallCallbacks: [undefined, undefined],
		observers: [],
	};
	afterInit(server: any) {
		this.logger.log('Initialized');
	}

	@SubscribeMessage('playerIdSelect')
	playerIdSelect(socket: Socket, playerId: number) {
		if (playerId < 2 && this.sockets.players[playerId] === undefined) {
			this.sockets.players[playerId] = socket;
			socket.emit("playerIdConfirmed", playerId);
		}
		else if (playerId < 2 && this.sockets.players[playerId] === socket) {
			socket.emit("playerIdAlreadySelected");
		}
		else if (playerId < 2) {
			socket.emit("playerIdUnavailable");
		}
		else if (playerId == 2) {
			if (this.sockets.observers.includes(socket))
				socket.emit("playerIdAlreadySelected");
			else {
				this.sockets.observers.push(socket);
				socket.emit("playerIdConfirmed", playerId);
			}
		}
		console.log(playerId < 2 ? `player ${playerId + 1} joined` : "an observer joined")
		if (this.sockets.players[0] !== undefined && this.sockets.players[1] !== undefined) {
			// this.game = new ServerGame();
			// this.setupSockets();
			console.log("both players are present");
			// this.start(-GSettings.BAR_INITIALX, GSettings.BAR_HEIGHT, LEFT);
		}
	}
}
