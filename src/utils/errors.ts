import { Response } from 'express'

const defaultInternalErrorMsg = 'some internal error happened, please try again later.'

export class ChainError extends Error {}

export const renderError = (res: Response, httpCode: number, e: unknown) => {
  const errorMessage = e != null && typeof e == 'object' && 'message' in e ? e.message : defaultInternalErrorMsg
  res.status(httpCode).json({ errorMessage })
}

export const renderShortenerMetadataError = (res: Response, e: string) => {
  renderError(res, 500, new Error("failed to generate shortened metadata: [" + e + "]" ))
}

export const renderInternalError = (res: Response, e: unknown) => {
  const errorMessage = e instanceof ChainError ? e.message : defaultInternalErrorMsg
  renderError(res, 500, new Error(errorMessage))
}

export const renderChainNotFoundError = (res: Response) => {
  renderError(res, 404, new Error('chain not found'))
}

export const renderGetMetadataFirstError = (res: Response) => {
  renderError(res, 400, new Error('please, cache metadata first with POST /node/metadata'))
}

export const renderMissingTxBlobError = (res: Response) => {
  renderError(res, 400, new Error('txBlob is missing on the request'))
}
