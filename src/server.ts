import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'

import { getChains } from './utils/chains'
import { transactionMetadata } from './handlers/transactionMetadata'
import { nodeProps } from './handlers/nodeProps'
import { nodeMetadataHash } from './handlers/nodeMetadataHash'
import { nodeMetadata } from './handlers/nodeMetadata'
import { nodeMetadataFlush } from './handlers/nodeMetadataFlush'
import { chains } from './handlers/chains'
import cors from 'cors'

export function createAndServe() {
  getChains()
  // Create a new express application instance
  const app: express.Application = express()
  // Middleware to parse JSON bodies

  app.use(cors())
  app.use(bodyParser.json())

  app.get('/chains', chains)
  app.post('/node/metadata/flush', nodeMetadataFlush)
  app.post('/node/metadata', nodeMetadata)
  app.post('/node/metadata/hash', nodeMetadataHash)
  app.post('/node/props', nodeProps)
  app.post('/transaction/metadata', transactionMetadata)

  const httpServer = http.createServer(app)
  httpServer.listen(3001, () => {
    console.log('Server running on http://0.0.0.0:3001/')
  })

  return httpServer
}
