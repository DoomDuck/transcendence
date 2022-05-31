"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    type: 'postgres',
    username: 'hgallien',
    password: 'root',
    port: 5432,
    host: '127.0.0.1',
    database: 'postgres',
    synchronize: true,
    entities: ['dist/**/*.entity{.ts,.js}']
};
//# sourceMappingURL=orm.config.js.map