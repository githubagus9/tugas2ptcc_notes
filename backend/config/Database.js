import { Sequelize } from "sequelize";

const db = new Sequelize('notes_db','root','',{
    host: '34.170.208.107',
    dialect: 'mysql'
});

export default db;