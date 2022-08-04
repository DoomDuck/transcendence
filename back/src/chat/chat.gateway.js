"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatGateway = void 0;
var user_dto_1 = require("../user/user.dto");
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var ChatGateway = /** @class */ (function () {
    function ChatGateway(userService, channelManagerService) {
        this.userService = userService;
        this.channelManagerService = channelManagerService;
        this.logger = new common_1.Logger('ChatGateway');
    }
    ChatGateway.prototype.afterInit = function (server) {
        this.logger.log('Initialized chat ');
    };
    ChatGateway.prototype.handleConnection = function (clientSocket) {
        this.logger.log("Client connected: ".concat(clientSocket.id));
        this.logger.log(clientSocket.handshake.auth.token);
        this.userService.addOne(new user_dto_1.UserDto(clientSocket.handshake.auth.token, clientSocket.handshake.auth.token, clientSocket));
    };
    //deprecated used to test on hugo.html
    ChatGateway.prototype.handleMessage = function (message) {
        this.logger.log('chat gateway handle message');
        this.wss.emit('chatToClient', message);
    };
    //Not sur if i'm gonna need client socket later
    ChatGateway.prototype.handleMessageChannel = function (messageInfoChannel) {
        this.channelManagerService.sendMessageToChannel(this.wss, messageInfoChannel);
    };
    ChatGateway.prototype.handleJoinChannel = function (clientSocket, joinInfo) {
        if (this.channelManagerService.joinChan(joinInfo.sender, joinInfo.channelId) === 'user added')
            this.userService.joinChanUser(joinInfo.sender, joinInfo.channelId);
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], ChatGateway.prototype, "wss");
    __decorate([
        (0, websockets_1.SubscribeMessage)('chatToServer')
    ], ChatGateway.prototype, "handleMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)('userToChannel')
    ], ChatGateway.prototype, "handleMessageChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)('joinChannel')
    ], ChatGateway.prototype, "handleJoinChannel");
    ChatGateway = __decorate([
        (0, websockets_1.WebSocketGateway)({ namespace: '/chat' })
    ], ChatGateway);
    return ChatGateway;
}());
exports.ChatGateway = ChatGateway;
