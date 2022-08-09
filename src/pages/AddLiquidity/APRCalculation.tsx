import { JSBI, Pair } from "@uniswap/sdk";
import { BigNumber } from '@ethersproject/bignumber'

export async function apr( lpPair:Pair, totalSupply: BigNumber, rewardRate: BigNumber){
   
    //const rewardRate = 0.1
    const blocksPerday = 6450 
    const tokenAreserve = JSBI.divide(lpPair.reserveOf(lpPair.token0).raw, JSBI.BigInt(10**lpPair.token0.decimals))
    const tokenBreserve = JSBI.divide(lpPair.reserveOf(lpPair.token1).raw, JSBI.BigInt(10**lpPair.token1.decimals))
    const tokenAPrice = JSBI.toNumber(tokenBreserve)/ JSBI.toNumber(tokenAreserve)
    const tokenBPrice = JSBI.divide(tokenAreserve, tokenBreserve)//JSBI.toNumber(tokenAreserve)/ JSBI.toNumber(tokenBreserve)
    const tokenOneLiquidity = JSBI.toNumber(tokenAreserve) * tokenAPrice
    const tokenTwoLiquidity = JSBI.multiply(tokenBreserve,  tokenBPrice)
    const totalLp =  JSBI.add(JSBI.BigInt(tokenOneLiquidity) , tokenTwoLiquidity)
    const lpTokenPrice = JSBI.toNumber(totalLp)/totalSupply.toNumber()
    //const apr =  (blocksPerday * rewardRate * tokenAPrice)/(lpTokenPrice)
    const apr =  (blocksPerday * rewardRate.toNumber() * tokenAPrice)/(JSBI.toNumber(totalLp))*52*100
    return ['Token A Price: ', tokenAPrice, 'Token B Price: ', tokenBPrice, 'Token A Reserve: ',JSBI.toNumber(tokenAreserve), 'Token B Reserve: ',JSBI.toNumber(tokenBreserve), tokenOneLiquidity, tokenTwoLiquidity, 'Token LP: ', totalLp, 'LP price: ', lpTokenPrice, "APR: ", apr, rewardRate.toNumber()]
}
