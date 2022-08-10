import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import { DFI } from '../constants'
import { useProxyToClaimContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

export function useTotalRewardsAccrued(proxyAddress?: string): TokenAmount | undefined {
  const contract = useProxyToClaimContract(proxyAddress, false)

  const inputs = useMemo(() => ['0x0000000000000000000000000000000000000000'], [])
  // totalRewardAccrued doesn't get updated that frequently, using checkReward's _totalRewardAccrued is better
  const totalRewardsAccrued: BigNumber = useSingleCallResult(contract, 'checkReward', inputs)?.result?.[1]

  return totalRewardsAccrued ? new TokenAmount(DFI[ChainId.MAINNET], totalRewardsAccrued.toString()) : undefined
}
