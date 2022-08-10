import { JSBI, Pair } from "@uniswap/sdk";
import { BigNumber } from '@ethersproject/bignumber'

export async function apr( lpPair:Pair, totalSupplyUni: BigNumber, rewardRate: BigNumber, totalStake: BigNumber){

    const blocksPerWeek = 6000 * 7
    const tokenAreserve = lpPair.reserveOf(lpPair.token0).raw
    const tokenBreserve = lpPair.reserveOf(lpPair.token1).raw
    const tokenAPrice = JSBI.toNumber(tokenBreserve) / JSBI.toNumber(tokenAreserve)
    const tokenOneLiquidity = JSBI.toNumber(tokenAreserve) * tokenAPrice
    const tokenTwoLiquidity = tokenBreserve
    const totalLp = tokenOneLiquidity + JSBI.toNumber(tokenTwoLiquidity)
    const rewardSpeed = (rewardRate.mul(blocksPerWeek))
    const rewardinTookenA = rewardSpeed.toNumber()*(tokenAPrice)
    //totalSupplyinCirculation = totalLp/totalSupplyUni
    const totalSupplyinCirculation = totalLp/JSBI.toNumber(JSBI.BigInt(totalSupplyUni.toString()))
    const apr = (rewardinTookenA * 52)/(totalSupplyinCirculation * totalStake.toNumber()) *100
    return ['Token A Price: ', tokenAPrice, 'Token A Reserve: ', JSBI.toNumber(tokenAreserve), 'Token B Reserve: ', JSBI.toNumber(tokenBreserve), 'Token LP: ', totalLp, "APR: ", apr, 'Reward Speed', rewardSpeed, totalSupplyinCirculation]
}
