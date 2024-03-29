import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { useGetClaimableRewardOfUser, useGetProxyLiquidityOfUser, useProxies } from '../../state/wallet/hooks'
import { TYPE, HideSmall } from '../../theme'
import { Text } from 'rebass'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { ProxyPair, usePairs2 } from '../../data/Reserves'
import { Dots } from '../../components/swap/styleds'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { DFI } from '../../constants/index'
import { MetaMaskInpageProvider } from '@metamask/providers'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`
//  background:radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
const VoteCard = styled(DataCard)`
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 60%;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  const proxies = useProxies()
  const [userProxyLiquidity, fetchingProxyLiquidity] = useGetProxyLiquidityOfUser(account ?? undefined, proxies)

  const proxyV2Pairs2 = usePairs2(proxies.map(p => [p.tokenA, p.tokenB, p.address]))
  const proxyV2PairsWithLiquidity2 = proxyV2Pairs2
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is ProxyPair => Boolean(v2Pair))

  const [userClaimableDfi, fetchingClaimable] = useGetClaimableRewardOfUser(account ?? undefined, proxies)

  const userProxyLiquidityIsLoading =
    fetchingProxyLiquidity ||
    fetchingClaimable ||
    proxyV2Pairs2?.length < proxies.length ||
    proxyV2Pairs2?.some(V2Pair => !V2Pair)

  async function addTokenFunction() {
    const ethereum = window.ethereum as MetaMaskInpageProvider
    try {
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            address: DFI[chainId!].address,
            symbol: 'DFI',
            decimals: 8,
            image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5804.png'
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>DFI Liquidity Mining Program</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {`Liquidity providers earn a 0.3% fee on all trades proportional to the share of the Uniswap pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity. Additional DFI rewards will also be distributed according to the share of the Rewards pool.`}
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>

        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>Pools</TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveButtonPrimary
                  id="join-pool-button"
                  as={Link}
                  padding="5px 8px"
                  borderRadius="12px"
                  to={`/add/${DFI[chainId!].address}/ETH`}
                >
                  <Text fontWeight={500} fontSize={16}>
                    Add Liquidity
                  </Text>
                </ResponsiveButtonPrimary>
                {account ? (
                  <ResponsiveButtonPrimary padding="5px 8px" borderRadius="12px" onClick={() => addTokenFunction()}>
                    <Text fontWeight={500} fontSize={16}>
                      Add DFI to Metamask
                    </Text>
                  </ResponsiveButtonPrimary>
                ) : (
                  ''
                )}
              </ButtonRow>
            </TitleRow>

            {userProxyLiquidityIsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : proxies?.length > 0 ? (
              <>
                {proxyV2PairsWithLiquidity2.map(v2Pair => (
                  <FullPositionCard
                    key={v2Pair.liquidityToken.address}
                    pair={v2Pair}
                    stakedBalance={userProxyLiquidity[v2Pair.proxyAddress]}
                    claimable={userClaimableDfi[v2Pair.proxyAddress]}
                    proxyAddress={v2Pair.proxyAddress}
                  />
                ))}
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  No liquidity found.
                </TYPE.body>
              </EmptyProposals>
            )}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
