import express from 'express'
import path from 'path'
import http from 'http'
import { ServerGame } from './ServerGame'
import { GameManager } from './GameManager'
import { Server as socketioServer, Socket } from 'socket.io'
import { GameEvent, LEFT } from '../common'

const port: number = 3000

class App {
    private server: http.Server
    private port: number
    private gameManager: GameManager;
    // private gameSockets: {
    //     players: [Socket, Socket],
    //     observers: Socket[],
    // }

    constructor(port: number) {
        this.port = port;
        const app = express();
        app.use(express.static(path.join(__dirname, '../client')));
        // In the webpack version of the boilerplate, it is not necessary
        // to add static references to the libs in node_modules if
        // you are using module specifiers in your client.ts imports.
        //
        // Visit https://sbcode.net/threejs/module-specifiers/ for info about module specifiers
        //
        // This server.ts is only useful if you are running this on a production server or you
        // want to see how the production version of bundle.js works
        //
        // to use this server.ts
        // # npm run build        (this creates the production version of bundle.js and places it in ./dist/client/)
        // # tsc -p ./src/server  (this compiles ./src/server/server.ts into ./dist/server/server.js)
        // # npm start            (this starts nodejs with express and serves the ./dist/client folder)
        //
        // visit http://127.0.0.1:3000

        this.server = new http.Server(app);
        const io = new socketioServer(this.server);
        let gameSockets = {
            players: [null, null] as [Socket, Socket],
            observers: [] as Socket[],
        };
        io.on("connect", (socket: Socket) => {
            console.log("client connected");
            socket.on("playerIdSelect", (playerId: number) => {
                if (playerId < 2 && gameSockets.players[playerId] === null) {
                    gameSockets.players[playerId] = socket;
                    socket.emit("playerIdConfirmed", playerId);
                }
                else if (playerId < 2 && gameSockets.players[playerId] === socket) {
                    socket.emit("playerIdAlreadySelected");
                }
                else if (playerId < 2) {
                    socket.emit("playerIdUnavailable");
                }
                else
                    gameSockets.observers.push(socket);
                console.log(playerId < 2 ? `player ${playerId} joined` : "an observer joined")
                if (gameSockets.players[0] !== null && gameSockets.players[1] !== null) {
                    this.gameManager = new GameManager(gameSockets);
                    console.log("both players are present, starting ")
                    this.gameManager.start(LEFT);
                }
            });
        });
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()
