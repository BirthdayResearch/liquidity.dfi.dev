import { Token, TokenAmount } from '@uniswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import {
  useEthLpContract,
  usePairContract,
  useProxyToClaimContract,
  useTokenContract,
  useUsdcLpContract,
  useUsdtLpContract
} from '../hooks/useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined
}

export function useTotalSupplyLP(address?: string) {
  const contract = usePairContract(address, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return address && totalSupply ? totalSupply : undefined
}

export function useUsdtRewardRate() {
  const rewardRate: BigNumber = useSingleCallResult(useUsdtLpContract(), 'admin_speed')?.result?.[0]
  const totalStake: BigNumber = useSingleCallResult(useUsdtLpContract(), 'totalStake')?.result?.[0]
  const contractStage: BigNumber = useSingleCallResult(useUsdtLpContract(), 'contract_stage')?.result?.[0]

  return rewardRate && totalStake && contractStage ? [rewardRate, totalStake, contractStage] : undefined
}

export function useUsdcRewardRate() {
  const rewardRate: BigNumber = useSingleCallResult(useUsdcLpContract(), 'admin_speed')?.result?.[0]
  const totalStake: BigNumber = useSingleCallResult(useUsdcLpContract(), 'totalStake')?.result?.[0]
  const contractStage: BigNumber = useSingleCallResult(useUsdcLpContract(), 'contract_stage')?.result?.[0]

  return rewardRate && totalStake && contractStage ? [rewardRate, totalStake, contractStage] : undefined
}

export function useWethRewardRate() {
  const rewardRate: BigNumber = useSingleCallResult(useEthLpContract(), 'rewardSpeed')?.result?.[0]
  const totalStake: BigNumber = useSingleCallResult(useEthLpContract(), 'totalStake')?.result?.[0]
  const contractStage: BigNumber = useSingleCallResult(useEthLpContract(), 'contract_stage')?.result?.[0]

  return rewardRate && totalStake && contractStage ? [rewardRate, totalStake, contractStage] : undefined
}

export function useTotalStake(proxyAddress?: string, token?: Token): TokenAmount | undefined {
  const contract = useProxyToClaimContract(proxyAddress, false)

  const totalStake: BigNumber = useSingleCallResult(contract, 'totalStake')?.result?.[0]

  return token && totalStake ? new TokenAmount(token, totalStake.toString()) : undefined
}
