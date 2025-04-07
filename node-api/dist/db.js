import { Sequelize } from "sequelize";
export const db = new Sequelize('postgres://postgres:mysecretpassword@localhost:5432/postgres', {});
