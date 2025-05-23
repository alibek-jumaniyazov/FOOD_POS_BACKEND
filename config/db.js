const mysql2 = require('mysql2')
const { default: env } = require("./config/env.config");

const db = mysql2.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE
}).promise()

export default db