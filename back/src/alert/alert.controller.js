"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.AlertController = void 0;
var common_1 = require("@nestjs/common");
var AlertController = /** @class */ (function () {
    function AlertController(alertGateway) {
        this.alertGateway = alertGateway;
    }
    AlertController.prototype.sendAlertToAll = function (dto) {
        this.alertGateway.sendToAll(dto.message);
        return dto;
    };
    __decorate([
        (0, common_1.Post)(),
        (0, common_1.HttpCode)(200),
        __param(0, (0, common_1.Body)())
    ], AlertController.prototype, "sendAlertToAll");
    AlertController = __decorate([
        (0, common_1.Controller)('alert')
    ], AlertController);
    return AlertController;
}());
exports.AlertController = AlertController;
