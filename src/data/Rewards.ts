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
  // Accounted for https://etherscan.io/address/0x189ff06a4cf9339124a0f950e6123182cef3ca71#tokentxns
  // account for DFI decimals
  const multiplier = BigNumber.from(10).pow(8)
  const totalRewardsAccruedAccounted =
    proxyAddress?.toLowerCase() === '0x743c5b2f134290741b6de9c330d5a2ff43c773d3'
      ? totalRewardsAccrued?.add(BigNumber.from(29500).mul(multiplier))
      : totalRewardsAccrued?.add(BigNumber.from(14750).mul(multiplier))
  return totalRewardsAccruedAccounted
    ? new TokenAmount(DFI[ChainId.MAINNET], totalRewardsAccruedAccounted.toString())
    : undefined
}
