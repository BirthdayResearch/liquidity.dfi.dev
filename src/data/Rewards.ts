import { ChainId, TokenAmount } from '@uniswap/sdk'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { DFI } from '../constants'
import { useProxyToClaimContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useCheckAddressReward(
  account: string | null | undefined,
  proxyAddress?: string
): TokenAmount | undefined {
  const contract = useProxyToClaimContract(proxyAddress, false)

  const inputs = useMemo(() => [account ?? undefined], [account])
  const accountRewards = useSingleCallResult(contract, 'checkReward', inputs)?.result
  console.log('accountRewards', accountRewards)

  return accountRewards ? new TokenAmount(DFI[ChainId.MAINNET], accountRewards.toString()) : undefined
}

export function useRewardSpeed(proxyAddress?: string): BigNumber | undefined {
  const contract = useProxyToClaimContract(proxyAddress, false)

  const rewardSpeed: BigNumber = useSingleCallResult(contract, 'rewardSpeed')?.result?.[0]

  return rewardSpeed ? rewardSpeed : undefined
}
