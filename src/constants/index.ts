import { ChainId, JSBI, Percent, Token, TokenAmount, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ProxyPair } from 'data/Reserves'

import { injected, walletconnect } from '../connectors'

export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}
 

export interface ProxyInfo {
  address: string
  chainId: number
  symbol: string
  underlyingPairAddress: string
  tokenA: Token
  tokenB: Token
}

export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const FEI = new Token(ChainId.MAINNET, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD')
export const TRIBE = new Token(ChainId.MAINNET, '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B', 18, 'TRIBE', 'Tribe')
export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'Frax')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const renBTC = new Token(ChainId.MAINNET, '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', 8, 'renBTC', 'renBTC')
//export const DFI = new Token(ChainId.MAINNET, '0x8fc8f8269ebca376d046ce292dc7eac40c8d358a', 8, 'DFI', 'DeFiChain')

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

// DFI GOERLI ADDRESS 
export const DFI_TEST_ADDRESS = '0xe5442CC9BA0FF56E4E2Edae51129bF3A1b45d673'
//MAINNET ADDRESS
const DFI_ADDRESS = '0x8fc8f8269ebca376d046ce292dc7eac40c8d358a'

// DFI is not deployed at RINKEBY | ROPSTEN | KOVAN: Arbitrage address
export const DFI: { [chainId in ChainId]: Token} = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, DFI_ADDRESS, 8, 'DFI', 'DeFiChain'),
  [ChainId.RINKEBY]: new Token(ChainId.GÖRLI, DFI_TEST_ADDRESS, 8, 'DFI', 'DFiChain'),
  [ChainId.ROPSTEN]: new Token(ChainId.GÖRLI, DFI_TEST_ADDRESS, 8, 'DFI', 'DFiChain'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, DFI_TEST_ADDRESS, 8, 'DFI', 'DFiChain'),
  [ChainId.KOVAN]: new Token(ChainId.GÖRLI, DFI_TEST_ADDRESS, 8, 'DFI', 'DFiChain')
}

//USDT
//export const MUSDT_TEST = '0xcf46184A1dB0dB31b05d42Cba17a2389f969Db72'
//export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const USDT: {[chainId in ChainId]: Token} = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD'),
  [ChainId.RINKEBY]: new Token(ChainId.GÖRLI, '0xcf46184A1dB0dB31b05d42Cba17a2389f969Db72', 6, 'MUSDT', 'Mock USDT'),
  [ChainId.ROPSTEN]: new Token(ChainId.GÖRLI, '0xcf46184A1dB0dB31b05d42Cba17a2389f969Db72', 6, 'MUSDT', 'Mock USDT'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xcf46184A1dB0dB31b05d42Cba17a2389f969Db72', 6, 'MUSDT', 'Mock USDT'),
  [ChainId.KOVAN]: new Token(ChainId.GÖRLI, '0xcf46184A1dB0dB31b05d42Cba17a2389f969Db72', 6, 'MUSDT', 'Mock USDT')
}

//USDC
//MockUSDT GOERLI USDT on other chain other than mainnet
export const USDC_T = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')//To avoid writing the whole code. USDC_T and USDC are the same.
export const USDC: {[chainId in ChainId]: Token} = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C'),
  [ChainId.RINKEBY]: new Token(ChainId.GÖRLI, '0xD14C4C4a024f15318a393A43De3b7DD9ad0Ce565', 6, 'MUSDC', 'Mock USDC'),
  [ChainId.ROPSTEN]: new Token(ChainId.GÖRLI, '0xD14C4C4a024f15318a393A43De3b7DD9ad0Ce565', 6, 'MUSDC', 'Mock USDC'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0xD14C4C4a024f15318a393A43De3b7DD9ad0Ce565', 6, 'MUSDC', 'Mock USDC'),
  [ChainId.KOVAN]: new Token(ChainId.GÖRLI, '0xD14C4C4a024f15318a393A43De3b7DD9ad0Ce565', 6, 'MUSDC', 'Mock USDC')

}

export const USDT_PROXY_ADDRESS: {[chainId in ChainId]: ProxyPair} = {
  [ChainId.MAINNET]: new ProxyPair(new TokenAmount(DFI[ChainId.MAINNET] as Token, '0'), new TokenAmount(USDT[ChainId.MAINNET] as Token, '0'),'0x9e251daeb17981477509779612dc2ffa8075aa8e'), // This still needs to be updated with mainnet address
  [ChainId.RINKEBY]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDT[ChainId.GÖRLI] as Token, '0'),'0x5fd39Bf6aE258351f453e55256B03085B34712f0'),
  [ChainId.ROPSTEN]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDT[ChainId.GÖRLI] as Token, '0'),'0x5fd39Bf6aE258351f453e55256B03085B34712f0'),
  [ChainId.GÖRLI]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDT[ChainId.GÖRLI] as Token, '0'),'0x5fd39Bf6aE258351f453e55256B03085B34712f0'),
  [ChainId.KOVAN]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDT[ChainId.GÖRLI] as Token, '0'),'0x5fd39Bf6aE258351f453e55256B03085B34712f0'),
}

export const USDC_PROXY_ADDRESS: {[chainId in ChainId]: ProxyPair} = {
  [ChainId.MAINNET]: new ProxyPair(new TokenAmount(DFI[ChainId.MAINNET] as Token, '0'), new TokenAmount(USDC[ChainId.MAINNET] as Token, '0'),'0xd239216ac7e44a09da67d6852cd757fc5e829fe2'), // This still needs to be updated with mainnet address
  [ChainId.RINKEBY]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDC[ChainId.GÖRLI] as Token, '0'),'0xABC0a27Fa5BB9f3E63CC0876614d9D83d3689ae2'),
  [ChainId.ROPSTEN]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDC[ChainId.GÖRLI] as Token, '0'),'0xABC0a27Fa5BB9f3E63CC0876614d9D83d3689ae2'),
  [ChainId.GÖRLI]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDC[ChainId.GÖRLI] as Token, '0'),'0xABC0a27Fa5BB9f3E63CC0876614d9D83d3689ae2'),
  [ChainId.KOVAN]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(USDC[ChainId.GÖRLI] as Token, '0'),'0xABC0a27Fa5BB9f3E63CC0876614d9D83d3689ae2'),
}

export const ETH_PROXY_ADDRESS: {[chainId in ChainId]: ProxyPair} = {
  [ChainId.MAINNET]: new ProxyPair(new TokenAmount(DFI[ChainId.MAINNET] as Token, '0'), new TokenAmount(WETH[ChainId.MAINNET] as Token, '0'),'0xb079d6be3faf5771e354586dbc47d0a3d37c34fb'), // This still needs to be updated with mainnet address
  [ChainId.RINKEBY]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(WETH[ChainId.GÖRLI] as Token, '0'),'0x69736086d7FF64e67ba0090229c9cdc1056fE039'),
  [ChainId.ROPSTEN]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(WETH[ChainId.GÖRLI] as Token, '0'),'0x69736086d7FF64e67ba0090229c9cdc1056fE039'),
  [ChainId.GÖRLI]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(WETH[ChainId.GÖRLI] as Token, '0'),'0x69736086d7FF64e67ba0090229c9cdc1056fE039'),
  [ChainId.KOVAN]: new ProxyPair(new TokenAmount(DFI[ChainId.GÖRLI] as Token, '0'), new TokenAmount(WETH[ChainId.GÖRLI] as Token, '0'),'0x69736086d7FF64e67ba0090229c9cdc1056fE039'),
}

// Proxy contact addresses
export const PROXIES: ProxyInfo[] = [
  {
    address: '0x5fd39Bf6aE258351f453e55256B03085B34712f0',
    chainId: ChainId.GÖRLI,
    symbol: 'USDT',
    underlyingPairAddress: '0xdb01EE311F15E870eE44d882b6256944f3f3129f',
    tokenA: DFI[ChainId.GÖRLI],
    tokenB: USDT[ChainId.GÖRLI]
  },
  {
    address: '0xABC0a27Fa5BB9f3E63CC0876614d9D83d3689ae2',
    chainId: ChainId.GÖRLI,
    symbol: 'USDC',
    underlyingPairAddress: '0x1157A50B6ac97F2A5CD686998D0DdBEB5175927a',
    tokenA: DFI[ChainId.GÖRLI],
    tokenB: USDC[ChainId.GÖRLI]
  },
  {
    address: '0x69736086d7FF64e67ba0090229c9cdc1056fE039',
    chainId: ChainId.GÖRLI,
    symbol: 'WETH',
    underlyingPairAddress: '0xad1c0376a026c148438ee89e1aa8a55d83ad0250',
    tokenA: DFI[ChainId.GÖRLI],
    tokenB: WETH[ChainId.GÖRLI]
  }
]

const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.ROPSTEN]: new Token(ChainId.ROPSTEN, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, UNI_ADDRESS, 18, 'UNI', 'Uniswap'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, UNI_ADDRESS, 18, 'UNI', 'Uniswap')
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC[ChainId.MAINNET], USDT[ChainId.MAINNET], WBTC]
}

export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    '0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18': [new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap')],
    '0x561a4717537ff4AF5c687328c0f7E90a319705C0': [new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap')],
    [FEI.address]: [TRIBE],
    [TRIBE.address]: [FEI],
    [FRAX.address]: [FXS],
    [FXS.address]: [FRAX],
    [WBTC.address]: [renBTC],
    [renBTC.address]: [WBTC]
  }
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC[ChainId.MAINNET], USDT[ChainId.MAINNET], WBTC]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC[ChainId.MAINNET], USDT[ChainId.MAINNET], WBTC]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
    [DAI, USDT[ChainId.MAINNET]]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]