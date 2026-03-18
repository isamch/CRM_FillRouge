import 'dotenv/config'
import app from './app.js'
import { connectMongo } from '#config/database.mongo.js'
import logger from '#config/logger.js'

const PORT = process.env.PORT ?? 3000

async function startServer() {
  try {
    await connectMongo()
    app.listen(PORT, () =>
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
    )
  } catch (err) {
    logger.error('Failed to start server', err)
    process.exit(1)
  }
}

startServer()
