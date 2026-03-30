import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { parseRouteRouter } from './routes/parseRoute'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

app.use(cors({
  origin: [
    clientUrl,
    'http://localhost:3000',
    'https://route-ai-4cf0b.web.app',
    'https://route-ai-4cf0b.firebaseapp.com',
  ],
}))
app.use(express.json())

app.use('/api', parseRouteRouter)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`[server] Running on http://localhost:${port}`)
})
