const  { cleanEnv, num, str } = require('envalid');
const dotenv = require('dotenv')
dotenv.config()

const env = cleanEnv(process.env, {
    PORT: num(),
    DB_HOST: str(),
    DB_PORT: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str()
})

module.exports = env