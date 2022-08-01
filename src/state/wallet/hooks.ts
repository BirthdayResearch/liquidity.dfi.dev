import { PROXIES, ProxyInfo, DFI} from './../../constants/index'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from '@uniswap/sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE, { USDT_LP_ABI_INTERFACE } from '../../constants/abis/erc20'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract} from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'
import { useUserUnclaimedAmount } from '../claim/hooks'
import { useTotalUniEarned } from '../stake/hooks'
import { Interface } from '@ethersproject/abi'


/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [addresses, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export enum BalState{
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}


export function useTokenBalancesEthProxy(
  address: (string | undefined)[], contractAbi : Interface, contractaddress: (string | undefined)[]
) {
  const results = useMultipleContractSingleData(contractaddress, contractAbi, 'stakingMap', address)
  
  return useMemo(()=>{
    return results.map((result)=>{
      const {result: bal, loading} = result
      if(loading) return [BalState.LOADING, null]
      if(!bal) return [BalState.NOT_EXISTS, null]
      return bal.toString()
      })
    }, [results]
  )

}

export function useTokenBalancesProxy(
  address?: string,
  tokens?: (Token | undefined)[],
  oneCurrencyIsETH?: boolean,
  oneCurrencyIsWETH?: boolean,
  oneCurrencyIsUSDT?:boolean
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )
  function checkContractAddress(){
    if ( oneCurrencyIsETH || oneCurrencyIsWETH ){
        return [PROXIES[2].address]
      } else if (oneCurrencyIsUSDT){
        return [PROXIES[0].address]
      } else{
        return [PROXIES[1].address]
      }
    }
  const balances = useMultipleContractSingleData(checkContractAddress(), USDT_LP_ABI_INTERFACE, 'stakingMap', [address])
  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalanceproxy(
  address?: string,
  tokens?: (Token | undefined)[],
  oneCurrencyIsETH?: boolean,
  oneCurrencyIsWETH?: boolean,
  oneCurrencyIsUSDT?:boolean
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesProxy(address, tokens, oneCurrencyIsETH, oneCurrencyIsWETH, oneCurrencyIsUSDT)[0]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateUniBalance(): TokenAmount | undefined {
  const { account, chainId } = useActiveWeb3React()

  const uni = chainId ? DFI[chainId] : undefined

  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)
  const uniUnclaimed: TokenAmount | undefined = useUserUnclaimedAmount(account)
  const uniUnHarvested: TokenAmount | undefined = useTotalUniEarned()

  if (!uni) return undefined

  return new TokenAmount(
    uni,
    JSBI.add(
      JSBI.add(uniBalance?.raw ?? JSBI.BigInt(0), uniUnclaimed?.raw ?? JSBI.BigInt(0)),
      uniUnHarvested?.raw ?? JSBI.BigInt(0)
    )
  )
}

export function useProxies(): ProxyInfo[] {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => PROXIES.filter(p => p.chainId === chainId), [chainId])
}

export function useGetProxyLiquidityOfUser(
  address?: string,
  proxies?: (ProxyInfo | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedProxies: ProxyInfo[] = useMemo(
    () => proxies?.filter((p?: ProxyInfo): p is ProxyInfo => isAddress(p?.address) !== false) ?? [],
    [proxies]
  )

  const proxyAddresses = useMemo(() => validatedProxies.map(p => p.address), [validatedProxies])
  const balances = useMultipleContractSingleData(proxyAddresses, USDT_LP_ABI_INTERFACE, 'stakingMap', [address])
  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedProxies.length > 0
          ? validatedProxies.reduce<{ [address: string]: TokenAmount | undefined }>((memo, proxy, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                const token = new Token(proxy.chainId, proxy.underlyingPairAddress, 18)
                memo[proxy.address] = new TokenAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedProxies, balances]
    ),
    anyLoading
  ]
}