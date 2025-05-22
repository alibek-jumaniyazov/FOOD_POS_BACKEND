import express from 'express'
import cors from 'cors'
import env from "./config/env.config.js"

const port = env.PORT || 3001

const appServer = express()

appServer.use(express.json())
appServer.use(cors())

appServer.get('/', (req, res) => {
   
})

appServer.listen(port, () => console.log(`Server is running on port ${port}`)) 