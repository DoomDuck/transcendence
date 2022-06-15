import express from 'express'
import path from 'path'
import http from 'http'
import { GameManager } from './GameManager'
import * as socketio from 'socket.io'

const port: number = 5000

class App {
    private server: http.Server
    private port: number
    private gameManager: GameManager;

    constructor(port: number) {
        this.port = port;
        const app = express();
        app.use('/public', express.static(path.join(__dirname, '../../../public/')));
        app.use('/build', express.static(path.join(__dirname, '../../../build/')));

        this.server = new http.Server(app);
        const io = new socketio.Server(this.server);
        this.gameManager = new GameManager(io.of("/pong"));
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()
