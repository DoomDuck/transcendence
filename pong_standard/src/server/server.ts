import express from 'express'
import path from 'path'
import http from 'http'
import socketio from 'socket.io'

const port: number = 3000

class App {
    private server: http.Server
    private port: number

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
        const io = new socketio.Server(this.server);
        let game = {
            players: [null, null],
            observers: [],
        };
        io.on("connect", (socket: socketio.Socket) => {
            console.log("client connected");
            socket.on("playerId", (playerId: number) => {
                if (playerId < 2)
                    game.players[playerId] = socket;
                else
                    game.observers.push(socket);
            });
            socket.on("bar", (barNumber: number, y: number) => {
                console.log("bar", barNumber, y);
                if (barNumber == 2)
                    game.players[0]?.emit("bar", 2, y);
                if (barNumber == 1)
                    game.players[1]?.emit("bar", 1, y);
                for (let sock of game.observers) {
                    sock.emit("bar", barNumber, y);
                }
            })

        });
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()
