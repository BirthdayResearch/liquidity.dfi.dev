import { Interface } from '@ethersproject/abi'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'
import { abi as STAKING_REWARDS_FACTORY_ABI } from '@uniswap/liquidity-staker/build/StakingRewardsFactory.json'
import  USDC_LP_ABI from './usdc-lp-proxy.json'

const STAKING_REWARDS_INTERFACE = new Interface(STAKING_REWARDS_ABI)

const STAKING_REWARDS_FACTORY_INTERFACE = new Interface(STAKING_REWARDS_FACTORY_ABI)

const USDC_STAKING_REWARDS_INTERFACE = new Interface(USDC_LP_ABI)

export { STAKING_REWARDS_FACTORY_INTERFACE, STAKING_REWARDS_INTERFACE, USDC_STAKING_REWARDS_INTERFACE }
