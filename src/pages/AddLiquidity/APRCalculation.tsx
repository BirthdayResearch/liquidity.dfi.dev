import { JSBI, Pair } from '@uniswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'

export function apr(
  lpPair: Pair,
  totalSupplyUni: BigNumber,
  rewardRate: BigNumber | undefined,
  totalStake: BigNumber | undefined
): number | undefined {
  if (rewardRate === undefined || totalStake === undefined) return undefined
  const blocksPerWeek = 6000 * 7
  const tokenAreserve = lpPair.reserveOf(lpPair.token0).raw
  const tokenBreserve = lpPair.reserveOf(lpPair.token1).raw
  const tokenAPrice = JSBI.toNumber(tokenBreserve) / JSBI.toNumber(tokenAreserve)
  const tokenOneLiquidity = JSBI.toNumber(tokenAreserve) * tokenAPrice
  const tokenTwoLiquidity = tokenBreserve
  const totalLp = tokenOneLiquidity + JSBI.toNumber(tokenTwoLiquidity)
  const rewardSpeed = rewardRate.mul(blocksPerWeek)
  const rewardinTookenA = rewardSpeed.toNumber() * tokenAPrice
  //totalSupplyinCirculation = totalLp/totalSupplyUni
  const totalSupplyinCirculation = totalLp / JSBI.toNumber(JSBI.BigInt(totalSupplyUni.toString()))
  const APR = ((rewardinTookenA * 52) / (totalSupplyinCirculation * totalStake.toNumber())) * 100
  return APR
}
