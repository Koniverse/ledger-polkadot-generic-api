import type { MetadataV15 } from '@polkadot/types/interfaces/metadata'
import { ChainInfoMap } from '@subwallet/chain-list'
import { _ChainStatus } from '@subwallet/chain-list/types'

import type { ChainProps } from '../types'

export type Chain = {
  id: string
  name: string
  url: string
  metadata?: MetadataV15
  metadataHex?: string
  props?: ChainProps
}

export type ChainsFile = { chains: Chain[] }

let chainsFile: ChainsFile | undefined;

const providerMap: Record<string, number> = {
  default: 0,
  shiden: 2,
  crabParachain: 1,
  shibuya: 1
}

export const getChains = (): Chain[] => {
  if (chainsFile) {
    return chainsFile.chains
  }

  chainsFile = loadChains()

  return chainsFile.chains;
}

function loadChains() {
  const chains: Chain[] = [];

  for (const info of Object.values(ChainInfoMap)) {
    if (info.chainStatus === _ChainStatus.ACTIVE && info.substrateInfo) {
      const providers = Object.values(info.providers);
      const skip = providers.length === 0 || Object.keys(info.providers).some((name) => name.includes('Fake')); // skip chains without providers or with fake providers
      if (!skip) {
        const providerIndex = providerMap[info.slug] ?? providerMap.default;
        const chain: Chain = {
          id: info.slug,
          name: info.name,
          url: providers[providerIndex]
        }
        chains.push(chain)
      }
    }
  }

  return { chains } as ChainsFile
}
