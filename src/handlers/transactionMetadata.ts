import { Response, Request } from 'express'
import { Chain, getChains } from '../utils/chains'
import {
  renderChainNotFoundError,
  renderGetMetadataFirstError,
  renderInternalError,
  renderMissingTxBlobError,
  renderShortenerMetadataError
} from '../utils/errors'
import { cacheMetadata } from '../utils/metadata'
import { getShortMetadataFromTxBlob } from '../../rust'
import { TxToSign } from '../utils/types'

const validHex = new RegExp(/^[a-fA-F0-9]+$/)

export const transactionMetadata = async (req: Request, res: Response) => {
  const chains = getChains()

  const {
    chain: { id: chainId },
  }: TxToSign = req.body
  let { txBlob }: TxToSign = req.body

  const chain = chains.find((b: Chain) => b.id === chainId)
  if (!chain) {
    renderChainNotFoundError(res)
    return
  }

  let { props, metadataHex } = chain
  if (!props || !metadataHex === undefined) {
    try {
      await cacheMetadata(chain)
    } catch (e) {
      renderInternalError(res, e)
      return
    }
  }

  ;({ props, metadataHex } = chain)
  if (!props || !metadataHex) {
    renderGetMetadataFirstError(res)
    return
  }

  if (!txBlob) {
    renderMissingTxBlobError(res)
    return
  }

  try {
    if (txBlob.substring(0, 2) == '0x') {
      txBlob = txBlob.substring(2)
    }

    const result = getShortMetadataFromTxBlob({ txBlob, metadata: metadataHex, props })

    if(!validHex.test(result)){
      renderShortenerMetadataError(res, result)
      return
    }
    const txMetadata = Buffer.from(result, 'hex')
    res.status(200).send({ txMetadata: '0x' + txMetadata.toString('hex') })
  } catch (e) {
    renderInternalError(res, e)
  }
}
