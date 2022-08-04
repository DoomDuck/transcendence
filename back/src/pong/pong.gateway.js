"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PongGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var PongGateway = /** @class */ (function () {
    function PongGateway(manager) {
        this.manager = manager;
        this.logger = new common_1.Logger("PongGateway");
    }
    PongGateway.prototype.handleConnection = function (client) {
        this.logger.log("socket connection ".concat(client.id));
        this.manager.add(client);
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], PongGateway.prototype, "wss");
    PongGateway = __decorate([
        (0, websockets_1.WebSocketGateway)({ namespace: "/pong" })
    ], PongGateway);
    return PongGateway;
}());
exports.PongGateway = PongGateway;
