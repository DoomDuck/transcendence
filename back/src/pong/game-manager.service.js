"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GameManagerService = void 0;
var common_1 = require("@nestjs/common");
var server_1 = require("pong/server");
function removeIfPresent(array, element) {
    var i = array.indexOf(element);
    if (i != -1)
        array.splice(i, 1);
}
var GameManagerService = /** @class */ (function () {
    function GameManagerService() {
        this.waitingClients = [];
        this.games = [];
        this.logger = new common_1.Logger("GameManagerService");
    }
    GameManagerService.prototype.add = function (socket) {
        var _this = this;
        this.waitingClients.push(socket);
        this.launchGameIfPossible();
        socket.on("disconnect", function () {
            removeIfPresent(_this.waitingClients, socket);
        });
    };
    GameManagerService.prototype.launchGameIfPossible = function () {
        var _this = this;
        if (this.waitingClients.length >= 2) {
            this.logger.log("two clients are waiting for a game");
            var gameInstance_1 = new server_1.ServerGameContext([this.waitingClients[0], this.waitingClients[1]], function () { return removeIfPresent(_this.games, gameInstance_1); });
            this.games.push(gameInstance_1);
            this.waitingClients[0].emit("playerIdConfirmed", 0, function () {
                _this.logger.log("player 0 ready");
                gameInstance_1.isReady(0);
            });
            this.waitingClients[1].emit("playerIdConfirmed", 1, function () {
                _this.logger.log("player 1 ready");
                gameInstance_1.isReady(1);
            });
            this.waitingClients.splice(0, 2);
        }
    };
    GameManagerService = __decorate([
        (0, common_1.Injectable)()
    ], GameManagerService);
    return GameManagerService;
}());
exports.GameManagerService = GameManagerService;
