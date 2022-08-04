"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var typeorm_1 = require("typeorm");
var databaseFile_entity_1 = require("./databaseFile.entity");
var User = /** @class */ (function () {
    function User(_name, _id) {
        if (_id)
            this.id = _id;
        this.name = _name;
        this.friendlist = [];
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false })
    ], User.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)('int', { array: true, nullable: false })
    ], User.prototype, "friendlist");
    __decorate([
        (0, typeorm_1.JoinColumn)({ name: 'avatarId' }),
        (0, typeorm_1.OneToOne)(function () { return databaseFile_entity_1.DatabaseFile; }, {
            nullable: true
        })
    ], User.prototype, "avatar");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], User.prototype, "avatarId");
    User = __decorate([
        (0, typeorm_1.Entity)('User')
    ], User);
    return User;
}());
exports.User = User;
