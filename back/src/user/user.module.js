"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.userModule = void 0;
var common_1 = require("@nestjs/common");
var user_controller_1 = require("./user.controller");
var channelManager_service_1 = require("../channelManager/channelManager.service");
var channelManager_controller_1 = require("../channelManager/channelManager.controller");
var databaseFile_controller_1 = require("./databaseFile.controller");
var user_service_1 = require("./user.service");
var databaseFile_service_1 = require("./databaseFile.service");
var user_entity_1 = require("./user.entity");
var databaseFile_entity_1 = require("./databaseFile.entity");
var typeorm_1 = require("@nestjs/typeorm");
var chat_gateway_1 = require("../chat/chat.gateway");
var userModule = /** @class */ (function () {
    function userModule() {
    }
    userModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
                typeorm_1.TypeOrmModule.forFeature([databaseFile_entity_1.DatabaseFile]),
            ],
            controllers: [user_controller_1.UserController, databaseFile_controller_1.DatabaseFilesController, channelManager_controller_1.ChannelController],
            providers: [
                chat_gateway_1.ChatGateway,
                user_service_1.UserService,
                databaseFile_service_1.DatabaseFilesService,
                channelManager_service_1.ChannelManagerService,
            ]
        })
    ], userModule);
    return userModule;
}());
exports.userModule = userModule;
