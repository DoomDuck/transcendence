"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var orm_config_1 = require("./orm.config");
var user_module_1 = require("./user/user.module");
var alert_gateway_1 = require("./alert/alert.gateway");
var alert_controller_1 = require("./alert/alert.controller");
var pong_gateway_1 = require("./pong/pong.gateway");
var game_manager_service_1 = require("./pong/game-manager.service");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forRoot(orm_config_1.config), user_module_1.userModule],
            controllers: [alert_controller_1.AlertController],
            providers: [alert_gateway_1.AlertGateway, pong_gateway_1.PongGateway, game_manager_service_1.GameManagerService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
