"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = require("path");
const http_1 = require("http");
const GameManager_1 = require("./GameManager");
const socketio = require("socket.io");
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        this.server = new http_1.default.Server(app);
        const io = new socketio.Server(this.server);
        this.gameManager = new GameManager_1.GameManager(io);
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map