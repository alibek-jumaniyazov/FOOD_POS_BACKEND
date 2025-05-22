import env from "./env.config.js"
import mysql2 from "mysql2"

const db = mysql2.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE
}).promise()

export default db