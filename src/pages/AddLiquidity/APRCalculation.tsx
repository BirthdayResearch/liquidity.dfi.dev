import { JSBI, Pair } from "@uniswap/sdk";
import { BigNumber } from '@ethersproject/bignumber'

export async function apr( lpPair:Pair, totalSupply: BigNumber, rewardRate: BigNumber, totalStake: BigNumber){
   //const re =  BigNumber.from(JSBI.toNumber(lpPair.reserveOf(lpPair.token0).raw))
    //const rewardRate = 0.1
    const rewardSpeed = rewardRate.toNumber()/10**lpPair.token0.decimals
    const blocksPerWeek = 6000*7
    const tokenAreserve = JSBI.divide(lpPair.reserveOf(lpPair.token0).raw, JSBI.BigInt(10**lpPair.token0.decimals))
    const tokenBreserve = JSBI.divide(lpPair.reserveOf(lpPair.token1).raw, JSBI.BigInt(10**lpPair.token1.decimals))
    const tokenAPrice = JSBI.toNumber(tokenBreserve)/ JSBI.toNumber(tokenAreserve)
    const tokenBPrice = JSBI.divide(tokenAreserve, tokenBreserve)
    const tokenOneLiquidity = JSBI.toNumber(tokenAreserve) * tokenAPrice
    const tokenTwoLiquidity = JSBI.multiply(tokenBreserve,  tokenBPrice)
    const totalLp =  tokenOneLiquidity + JSBI.toNumber(tokenTwoLiquidity)
    const totalSupplyUni = totalSupply.toNumber()/10**18
    const lpTokenPrice = (totalLp/totalSupplyUni)
    const totalStaked = totalStake.toNumber()/10**18
    //const totalRewardPerDay = rewardSpeed * blocksPerDay
    //const poolDailyRewardRate = totalRewardPerDay / totalStaked
    
    const apr = (blocksPerWeek * rewardSpeed * tokenAPrice *52) / ((totalLp / totalSupplyUni) * totalStaked )*100
    return ['Token A Price: ', tokenAPrice, 'Token B Price: ', tokenBPrice, 'Token A Reserve: ',JSBI.toNumber(tokenAreserve), 'Token B Reserve: ' ,JSBI.toNumber(tokenBreserve), 'Token LP: ', totalLp, 'LP price: ', lpTokenPrice, "APR: ", apr, 'Reward Speed',rewardSpeed]
}
