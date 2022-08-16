import { Pair } from '@uniswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import BN from 'bignumber.js'

export const apr = (
  lpPair: Pair,
  totalSupplyUni: BigNumber,
  rewardRate: BigNumber | undefined,
  totalStake: BigNumber | undefined
): number | undefined => {
  if (rewardRate === undefined || totalStake === undefined) return undefined
  const rewardRateBN = new BN(rewardRate.toString())
  const totalStakeBN = new BN(totalStake.toString())
  const totalSupplyUniBN = new BN(totalSupplyUni.toString())
  const blocksPerWeek = 6000 * 7
  const tokenAreserve = new BN(lpPair.reserveOf(lpPair.token0).raw.toString())
  const tokenBreserve = new BN(lpPair.reserveOf(lpPair.token1).raw.toString())
  const tokenAPrice = tokenBreserve.div(tokenAreserve)
  // we consider the values of tokenBReserve and tokenAreserve are the same
  const totalLp = tokenBreserve.times(2)
  const rewardSpeed = rewardRateBN.times(blocksPerWeek)

  const rewardinTokenA = rewardSpeed.times(tokenAPrice)
  const uniTokenPrice = totalLp.div(totalSupplyUniBN)
  const APR = rewardinTokenA
    .times(52)
    .div(uniTokenPrice.times(totalStakeBN))
    .times(100)
  return APR.toNumber()
}
