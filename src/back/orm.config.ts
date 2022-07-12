import { type TypeOrmModuleOptions } from "@nestjs/typeorm";
// import {  car } from "./car/car.entity";
import { user } from "./user/user.entity";

export const config: TypeOrmModuleOptions = {
  type: "postgres",
  username: "hgallien",
  password: "root",
  port: 5432,
  host: "127.0.0.1",
  database: "postgres",
  synchronize: true,
  entities: [user],
  // entities: ["dist/**/*.entity{.ts,.js}"],
};
