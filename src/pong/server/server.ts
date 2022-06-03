import express from 'express'
import path from 'path'
import http from 'http'
import { GameManager } from './GameManager'
import * as socketio from 'socket.io'

const port: number = 3000

class App {
    private server: http.Server
    private port: number
    private gameManager: GameManager;

    constructor(port: number) {
        this.port = port;
        const app = express();
        app.use(express.static(path.join(__dirname, '../client')));

        this.server = new http.Server(app);
        const io = new socketio.Server(this.server);
        this.gameManager = new GameManager(io.of("/"));
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()
