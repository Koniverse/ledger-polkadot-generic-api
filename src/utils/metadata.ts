import { ApiPromise } from '@polkadot/api'
import { getApi } from './getApi'
import { Option } from '@polkadot/types'
import { OpaqueMetadata } from '@polkadot/types/interfaces'
import { getProperties } from './getProperties'
import { Chain } from './chains'
import { ChainError } from './errors'

export async function cacheMetadata(chain: Chain) {
  const { url } = chain
  const api = await new Promise<ApiPromise>((resolve, reject) => {
    setTimeout(() => {
      reject(new ChainError('Connection timeout'))
    }, 60000);

    getApi(url)
      .then(resolve)
      .catch(reject)
  })

  if (!chain.metadata || !chain.metadataHex) {
    if (api.runtimeMetadata.version !== 14) {
      throw new ChainError('Only metadata V14 is supported')
    }

    const metadataV15Hex = await api.call.metadata.metadataAtVersion<Option<OpaqueMetadata>>(15).then(m => {
      if (!m.isNone) {
        return m.unwrap().toHex().slice(2)
      }
    })

    if (!metadataV15Hex) {
      throw new ChainError('Only metadata V15 is supported')
    }

    chain.metadata = api.runtimeMetadata.asV15
    chain.metadataHex = metadataV15Hex
  }

  if (!chain.props) {
    chain.props = await getProperties(api)
  }

  await api.disconnect()
}
