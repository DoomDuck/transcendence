"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
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
        this.server = new http_1.default.Server(app);
        const io = new socket_io_1.default.Server(this.server);
        let game = {
            players: [null, null],
            observers: [],
        };
        io.on("connect", (socket) => {
            console.log("client connected");
            socket.on("playerId", (playerId) => {
                if (playerId < 2)
                    game.players[playerId] = socket;
                else
                    game.observers.push(socket);
            });
            socket.on("bar", (barNumber, y) => {
                var _a, _b;
                console.log("bar", barNumber, y);
                if (barNumber == 2)
                    (_a = game.players[0]) === null || _a === void 0 ? void 0 : _a.emit("bar", 2, y);
                if (barNumber == 1)
                    (_b = game.players[1]) === null || _b === void 0 ? void 0 : _b.emit("bar", 1, y);
                for (let sock of game.observers) {
                    sock.emit("bar", barNumber, y);
                }
            });
        });
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}
new App(port).Start();
