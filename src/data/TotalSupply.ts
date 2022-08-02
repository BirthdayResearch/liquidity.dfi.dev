import { BigNumber } from '@ethersproject/bignumber'
import { Token, TokenAmount } from '@uniswap/sdk'
import { useProxyToClaimContract, useTokenContract } from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined
}

export function useTotalStake(proxyAddress?: string, token?: Token): TokenAmount | undefined {
  const contract = useProxyToClaimContract(proxyAddress, false)

  const totalStake: BigNumber = useSingleCallResult(contract, 'totalStake')?.result?.[0]

  return token && totalStake ? new TokenAmount(token, totalStake.toString()) : undefined

}