"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SocketGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var SocketGateway = /** @class */ (function () {
    function SocketGateway() {
        this.logger = new common_1.Logger('AppGateway');
    }
    SocketGateway.prototype.afterInit = function (server) {
        this.logger.log('Initialized penis');
    };
    SocketGateway.prototype.handleDisconnect = function (client) {
        this.logger.log("Client disconnected: ".concat(client.id));
    };
    SocketGateway.prototype.handleConnection = function (client) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.logger.log("Client connected: ".concat(client.id));
    };
    SocketGateway.prototype.handleMessage = function (client, text) {
        this.logger.log('socker gateway handle message');
        return { event: 'msgToClient', data: text };
    };
    __decorate([
        (0, websockets_1.SubscribeMessage)('msgToServer')
    ], SocketGateway.prototype, "handleMessage");
    SocketGateway = __decorate([
        (0, websockets_1.WebSocketGateway)()
    ], SocketGateway);
    return SocketGateway;
}());
exports.SocketGateway = SocketGateway;
