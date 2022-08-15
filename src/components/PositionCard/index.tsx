import { currencyEquals, JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { darken } from 'polished'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import {
  useTotalStake,
  useTotalSupply,
  useTotalSupplyLP,
  useUsdcRewardRate,
  useUsdtRewardRate,
  useWethRewardRate
} from '../../data/TotalSupply'
import BN from 'bignumber.js'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonPrimary, ButtonEmpty } from '../Button'
import { transparentize } from 'polished'
import { CardNoise } from '../earn/styled'

import { useColor } from '../../hooks/useColor'

import Card, { GreyCard, LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed, AutoRow } from '../Row'
import { Dots } from '../swap/styleds'
import { BIG_INT_ZERO, USDC, USDT } from '../../constants'
import { useClaimRewardProxyCallback } from 'hooks/useApproveCallback'
import { apr } from 'pages/AddLiquidity/APRCalculation'
import { useTotalRewardsAccrued } from 'data/Rewards'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid transparent;
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`
const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  background: ${({ theme, bgColor }) =>
    `radial-gradient(91.85% 100% at 1.84% 0%, ${transparentize(0.8, bgColor)} 0%, ${theme.bg3} 100%) `};
  position: relative;
  overflow: hidden;
`

const ContentCard = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const HideOnMobile = styled.div`
  display: none;

  @media only screen and (min-width: 768px) {
    display: block;
  }
`

const Badge = styled.div`
  box-sizing: border-box;
  margin: 0 8px 0 0;
  color: rgb(255 255 255);
  font-size: 14px;
  line-height: 1.5715;
  list-style: none;
  display: inline-block;
  height: auto;
  padding: 0 7px;
  font-size: 12px;
  white-space: nowrap;
  background: rgb(255 51 191);
  border-radius: 8px;
  opacity: 1;
  transition: all 0.3s;
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: TokenAmount // optional balance to indicate that liquidity is deposited in mining pool
  claimable?: TokenAmount
  proxyAddress?: string
  aprValue?: number
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + '%' : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{' '}
            By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the pool.
            Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border, stakedBalance, claimable, proxyAddress }: PositionCardProps) {
  const { chainId } = useActiveWeb3React()
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  const totalStake = useTotalStake(proxyAddress, pair.liquidityToken)
  const rewardsPoolSharePercentage =
    !!totalStake && !!totalPoolTokens // handle totalPoolTokens = 0 to prevent division by zero
      ? new Percent(totalStake.raw, totalPoolTokens.raw)
      : undefined
  const totalRewardsAccrued = useTotalRewardsAccrued(proxyAddress)

  const userPoolBalance = stakedBalance

  const poolTokenPercentage =
    !!userPoolBalance && !!totalStake && JSBI.greaterThanOrEqual(totalStake.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalStake.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  const claimCallback = useClaimRewardProxyCallback(proxyAddress ?? '')

  // APR calculations
  const totalSupply = useTotalSupplyLP(pair.liquidityToken.address)!
  const rewardRateETH = useWethRewardRate()
  const rewardRateUSDT = useUsdtRewardRate()
  const rewardRateUSDC = useUsdcRewardRate()

  const oneCurrencyIsUSDT = Boolean(
    chainId &&
      ((currency0 && currencyEquals(currency0, USDT[chainId])) ||
        (currency1 && currencyEquals(currency1, USDT[chainId])))
  )
  const oneCurrencyIsUSDC = Boolean(
    chainId &&
      ((currency0 && currencyEquals(currency0, USDC[chainId])) ||
        (currency1 && currencyEquals(currency1, USDC[chainId])))
  )

  function checkRewardContract(): BigNumber | undefined {
    if (oneCurrencyIsUSDC) {
      return rewardRateUSDC ? rewardRateUSDC[0] : undefined
    } else if (oneCurrencyIsUSDT) {
      return rewardRateUSDT ? rewardRateUSDT[0] : undefined
    } else {
      return rewardRateETH ? rewardRateETH[0] : undefined
    }
  }
  function checkTotalStake(): BigNumber | undefined {
    if (oneCurrencyIsUSDC) {
      return rewardRateUSDC ? rewardRateUSDC[1] : undefined
    } else if (oneCurrencyIsUSDT) {
      return rewardRateUSDT ? rewardRateUSDT[1] : undefined
    } else {
      return rewardRateETH ? rewardRateETH[1] : undefined
    }
  }
  let aprValue: BN | undefined = new BN(0)
  if (pair && totalSupply && checkRewardContract() && checkTotalStake()) {
    aprValue = apr(pair, totalSupply, checkRewardContract(), checkTotalStake())
    //console.log(aprValue, chainId)
  }

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      <CardNoise />
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
            <Text fontWeight={500} fontSize={14}>
              <Badge>{aprValue ? aprValue.decimalPlaces(2)+ '% APR' : ''}</Badge>
            </Text>
          </AutoRow>
          <RowFixed gap="8px">
            <ButtonEmpty
              padding="6px 8px"
              borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  <HideOnMobile>Manage</HideOnMobile>
                  <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                <>
                  <HideOnMobile>Manage</HideOnMobile>
                  <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={700}>
                Rewards pool stats
              </Text>
            </FixedHeightRow>

            <ContentCard>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  APR:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {aprValue ? aprValue.decimalPlaces(2) + '%' : ''}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Rewards pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {rewardsPoolSharePercentage ? rewardsPoolSharePercentage.toSignificant(2) + '%' : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Total rewards accrued:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {totalRewardsAccrued ? totalRewardsAccrued.toSignificant(4) + ' DFI' : '0'}
                </Text>
              </FixedHeightRow>
            </ContentCard>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={700}>
                Your liquidity position
              </Text>
            </FixedHeightRow>

            {userPoolBalance ? (
              <ContentCard>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    Your total pool tokens:
                  </Text>
                  <Text fontSize={16} fontWeight={500}>
                    {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                  </Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500}>
                      Pooled {currency0.symbol}:
                    </Text>
                  </RowFixed>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                        {token0Deposited?.toSignificant(6)}
                      </Text>
                      <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>

                <FixedHeightRow>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500}>
                      Pooled {currency1.symbol}:
                    </Text>
                  </RowFixed>
                  {token1Deposited ? (
                    <RowFixed>
                      <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                        {token1Deposited?.toSignificant(6)}
                      </Text>
                      <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>

                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    Your pool share:
                  </Text>
                  <Text fontSize={16} fontWeight={500}>
                    {poolTokenPercentage?.greaterThan('0')
                      ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                      : '-'}
                  </Text>
                </FixedHeightRow>
                {claimable && (
                  <FixedHeightRow>
                    <Text fontSize={16} fontWeight={500}>
                      Claimable DFI:
                    </Text>
                    <Text fontSize={16} fontWeight={500}>
                      {claimable?.toFixed(4, { groupSeparator: ',' })} DFI
                    </Text>
                  </FixedHeightRow>
                )}
              </ContentCard>
            ) : (
              <ContentCard>Please connect to a wallet to view your position.</ContentCard>
            )}

            {userPoolBalance && (
              <RowBetween marginTop="10px">
                <ButtonPrimary
                  padding="8px"
                  borderRadius="8px"
                  as={Link}
                  to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                  width={JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) ? '32%' : '100%'}
                >
                  Add
                </ButtonPrimary>
                {JSBI.greaterThan(userPoolBalance.raw, BIG_INT_ZERO) && (
                  <>
                    <ButtonPrimary
                      padding="8px"
                      borderRadius="8px"
                      as={Link}
                      width="32%"
                      to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                    >
                      Remove
                    </ButtonPrimary>
                    <ButtonPrimary
                      padding="8px"
                      borderRadius="8px"
                      onClick={claimCallback}
                      disabled={claimable && claimable.greaterThan('0') ? false : true}
                      width="32%"
                    >
                      Claim
                    </ButtonPrimary>
                  </>
                )}
              </RowBetween>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
