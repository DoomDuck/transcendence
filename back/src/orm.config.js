"use strict";
exports.__esModule = true;
exports.config = void 0;
var user_entity_1 = require("./user/user.entity");
var databaseFile_entity_1 = require("./user/databaseFile.entity");
exports.config = {
    type: 'postgres',
    username: 'hgallien',
    password: 'root',
    port: 5432,
    host: '127.0.0.1',
    database: 'postgres',
    synchronize: true,
    entities: [user_entity_1.User, databaseFile_entity_1.DatabaseFile]
};
