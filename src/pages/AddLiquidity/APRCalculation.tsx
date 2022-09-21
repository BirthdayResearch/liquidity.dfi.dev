import { Pair } from '@uniswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import BN from 'bignumber.js'

export const apr = (
  lpPair: Pair,
  totalSupplyUni: BigNumber,
  adminRate: BigNumber | undefined,
  totalStake: BigNumber | undefined,
  contractStage: BigNumber | undefined,
  currentBlockNum: BigNumber | undefined
): number | undefined => {
  let APR: number
  const endColBlock = BigNumber.from(15389352)
  if (
    adminRate === undefined ||
    totalStake === undefined ||
    contractStage === undefined ||
    currentBlockNum === undefined
  )
    return undefined
  if (contractStage.toString() === '3') return (APR = 0)
  let rewardPerBlock = adminRate
  const totalStakeBN = new BN(totalStake.toString())
  const totalSupplyUniBN = new BN(totalSupplyUni.toString())
  const blocksPerWeek = 7200 * 7
  const currEpoch = currentBlockNum.sub(endColBlock).div(blocksPerWeek)
  for (let i = 0; currEpoch.gt(i); i++) {
    rewardPerBlock = rewardPerBlock.mul(96).div(100)
  }
  const tokenAreserve = new BN(lpPair.reserveOf(lpPair.token0).raw.toString())
  const tokenBreserve = new BN(lpPair.reserveOf(lpPair.token1).raw.toString())
  const tokenAPrice = tokenBreserve.div(tokenAreserve)
  // we consider the values of tokenBReserve and tokenAreserve are the same
  const totalLp = tokenBreserve.times(2)
  const rewardPerWeek = new BN(rewardPerBlock.toString()).times(blocksPerWeek)

  const rewardPerWeekMeasuredByTokenB = rewardPerWeek.times(tokenAPrice)
  const uniTokenPrice = totalLp.div(totalSupplyUniBN)
  APR = rewardPerWeekMeasuredByTokenB
    .times(52)
    .div(uniTokenPrice.times(totalStakeBN))
    .times(100)
    .toNumber()
  return APR
}
