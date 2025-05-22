import { cleanEnv, num, str } from "envalid";
import { config } from "dotenv";
config()

const env = cleanEnv(process.env, {
    PORT: num(),
    DB_HOST: str(),
    DB_PORT: str(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_DATABASE: str(),
  
})

export default env