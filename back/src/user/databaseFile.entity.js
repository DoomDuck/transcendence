"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DatabaseFile = void 0;
var typeorm_1 = require("typeorm");
var DatabaseFile = /** @class */ (function () {
    function DatabaseFile(_filename, _data) {
        this.filename = _filename;
        this.data = _data;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], DatabaseFile.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], DatabaseFile.prototype, "filename");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'bytea'
        })
    ], DatabaseFile.prototype, "data");
    DatabaseFile = __decorate([
        (0, typeorm_1.Entity)()
    ], DatabaseFile);
    return DatabaseFile;
}());
exports.DatabaseFile = DatabaseFile;
