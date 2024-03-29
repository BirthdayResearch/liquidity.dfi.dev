import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, Percent, TokenAmount, WETH } from '@uniswap/sdk'
import React, { useCallback, useContext, useState } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga4'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { AddRemoveTabs } from '../../components/NavigationTabs'
import Row, { RowBetween, RowFlat } from '../../components/Row'
import { USDT } from '../../constants/index'
import { PROXIES } from '../../constants'
import { PairState, ProxyPair, usePairs2 } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import {
  calculateGasMargin,
  calculateSlippageAmount,
  getETHProxyContract,
  getUSDTProxyContract,
  getUSDCProxyContract
} from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { currencyId } from '../../utils/currencyId'
import { PoolPriceBar } from './PoolPriceBar'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import { useProxies } from 'state/wallet/hooks'
import { useTotalStake } from 'data/TotalSupply'

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )
  const oneCurrencyIsUSDT = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, USDT[chainId])) ||
        (currencyB && currencyEquals(currencyB, USDT[chainId])))
  )
  const oneCurrencyIsETH = Boolean(
    chainId && ((currencyA && currencyEquals(currencyA, ETHER)) || (currencyB && currencyEquals(currencyB, ETHER)))
  )

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  //ETH APPROVAL
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], PROXIES[2].address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], PROXIES[2].address)
  //USDT APPROVAL
  const [approvalC, approveCCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], PROXIES[0].address)
  const [approvalD, approveDCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], PROXIES[0].address)
  //USDC APPROVAL
  const [approvalE, approveECallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], PROXIES[1].address)
  const [approvalF, approveFCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], PROXIES[1].address)

  // get rewards pool share
  const proxies = useProxies()
  const currentProxy = proxies.filter(p => {
    return oneCurrencyIsETH
      ? (currencyIdA === p.tokenA.address &&
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' === p.tokenB.address.toLocaleLowerCase()) ||
          (currencyIdA === p.tokenB.address &&
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' === p.tokenA.address.toLocaleLowerCase())
      : (currencyIdA === p.tokenA.address && currencyIdB === p.tokenB.address) ||
          (currencyIdA === p.tokenB.address && currencyIdB === p.tokenA.address)
  })

  const proxyV2Pairs2 = usePairs2(currentProxy.map(p => [p.tokenA, p.tokenB, p.address]))
  const proxyV2PairsWithLiquidity2 = proxyV2Pairs2
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is ProxyPair => Boolean(v2Pair))
  const currentProxyStake = useTotalStake(currentProxy[0]?.address, proxyV2PairsWithLiquidity2[0]?.liquidityToken)

  const rewardsPoolPercentage =
    liquidityMinted && currentProxyStake
      ? new Percent(liquidityMinted?.raw, currentProxyStake?.add(liquidityMinted).raw)
      : undefined

  function checkAPendingApprove() {
    if (oneCurrencyIsWETH || oneCurrencyIsETH) {
      return approvalA === ApprovalState.PENDING
    } else if (oneCurrencyIsUSDT) {
      return approvalC === ApprovalState.PENDING
    } else {
      return approvalE === ApprovalState.PENDING
    }
  }
  function checkBPendingApprove() {
    if (oneCurrencyIsWETH || oneCurrencyIsETH) {
      return approvalB === ApprovalState.PENDING
    } else if (oneCurrencyIsUSDT) {
      return approvalD === ApprovalState.PENDING
    } else {
      return approvalF === ApprovalState.PENDING
    }
  }

  function checkANotApprove() {
    if (oneCurrencyIsWETH || oneCurrencyIsETH) {
      return approvalA === ApprovalState.NOT_APPROVED
    } else if (oneCurrencyIsUSDT) {
      return approvalC === ApprovalState.NOT_APPROVED
    } else {
      return approvalE === ApprovalState.NOT_APPROVED
    }
  }
  function checkBNotApprove() {
    if (oneCurrencyIsWETH || oneCurrencyIsETH) {
      return approvalB === ApprovalState.NOT_APPROVED
    } else if (oneCurrencyIsUSDT) {
      return approvalD === ApprovalState.NOT_APPROVED
    } else {
      return approvalF === ApprovalState.NOT_APPROVED
    }
  }

  function checkAApprove() {
    if (oneCurrencyIsWETH || oneCurrencyIsETH) {
      return approvalA !== ApprovalState.APPROVED
    } else if (oneCurrencyIsUSDT) {
      return approvalC !== ApprovalState.APPROVED
    } else {
      return approvalE !== ApprovalState.APPROVED
    }
  }

  function checkBApprove() {
    if (oneCurrencyIsWETH || oneCurrencyIsETH) {
      return approvalB !== ApprovalState.APPROVED
    } else if (oneCurrencyIsUSDT) {
      return approvalD !== ApprovalState.APPROVED
    } else {
      return approvalF !== ApprovalState.APPROVED
    }
  }

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getETHProxyContract(chainId, library, account)
    if (!chainId || !library || !account) return
    const usdtProxy = getUSDTProxyContract(chainId, library, account)
    if (!chainId || !library || !account) return
    const usdcProxy = getUSDCProxyContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        // wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        //account,
        deadline.toHexString()
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      if (oneCurrencyIsWETH) {
        estimate = router.estimateGas.addLiquidity
        method = router.addLiquidity
      } else if (oneCurrencyIsUSDT) {
        estimate = usdtProxy.estimateGas.addLiquidity
        method = usdtProxy.addLiquidity
      } else {
        estimate = usdcProxy.estimateGas.addLiquidity
        method = usdcProxy.addLiquidity
      }

      args = [
        //wrappedCurrency(currencyA, chainId)?.address ?? '',
        //wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        //account,
        deadline.toHexString()
      ]
      value = null
    }

    ReactGA.event({
      category: 'Liquidity',
      action: 'Add Attempt',
      label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
    })

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="25px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
              {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="25px">
        <RowFlat style={{ marginTop: '20px' }}>
          <Text fontSize="30px" fontWeight={500} lineHeight="42px" marginRight={10}>
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={25}
          />
        </RowFlat>
        <Row>
          <Text fontSize="24px">
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol + ' Pool Tokens'}
          </Text>
        </Row>
        <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>
          {`Output is estimated. If the price changes by more than ${allowedSlippage /
            100}% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={rewardsPoolPercentage}
      />
    )
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const isCreate = history.location.pathname.includes('/create')

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  return (
    <>
      <AppBody>
        <AddRemoveTabs creating={isCreate} adding={true} />
        <Wrapper>
          <TransactionConfirmationModal
            isOpen={showConfirm}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => (
              <ConfirmationModalContent
                title={noLiquidity ? 'You are creating a pool' : 'Your LP tokens'}
                onDismiss={handleDismissConfirmation}
                topContent={modalHeader}
                bottomContent={modalBottom}
              />
            )}
            pendingText={pendingText}
            currencyToAdd={pair?.liquidityToken}
          />
          <AutoColumn gap="20px">
            {noLiquidity ||
              (isCreate ? (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={600} color={'primaryText1'}>
                        You are the first liquidity provider.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={'primaryText1'}>
                        The ratio of tokens you add will set the price of this pool.
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={'primaryText1'}>
                        Once you are happy with the rate click supply to review.
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ) : (
                <>
                  <ColumnCenter>
                    <BlueCard>
                      <AutoColumn gap="30px">
                        <TYPE.link fontWeight={400} color={'primaryText1'}>
                          <b>Tip:</b> When you add liquidity, this smart contract will receive the tokens representing
                          your position. These tokens automatically earn fees proportional to your share of the pool,
                          and additional DFI rewards. It can be redeemed at any time.
                        </TYPE.link>
                      </AutoColumn>
                    </BlueCard>
                  </ColumnCenter>
                </>
              ))}
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A] && maxAmounts[Field.CURRENCY_A]?.toExact() !== '0'}
              showGetDFI={maxAmounts[Field.CURRENCY_A]?.toExact() === '0'}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              //showCommonBases
              disableCurrencySelect={true}
            />
            <ColumnCenter>
              <Plus size="16" color={theme.text2} />
            </ColumnCenter>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
              disableCurrencySelect={false}
            />
            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                <LightCard padding="0px" borderRadius={'20px'}>
                  <RowBetween padding="1rem">
                    <TYPE.subHeader fontWeight={500} fontSize={14}>
                      {noLiquidity ? 'Initial prices' : 'Prices'} and pool share
                    </TYPE.subHeader>
                  </RowBetween>{' '}
                  <LightCard padding="1rem" borderRadius={'20px'}>
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={rewardsPoolPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </LightCard>
                </LightCard>
              </>
            )}

            {addIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
              </ButtonPrimary>
            ) : !account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
              <AutoColumn gap={'md'}>
                {(checkANotApprove() || checkAPendingApprove() || checkBNotApprove() || checkBPendingApprove) &&
                  isValid && (
                    <RowBetween>
                      {checkAApprove() && (
                        <ButtonPrimary
                          onClick={
                            oneCurrencyIsWETH || oneCurrencyIsETH
                              ? approveACallback
                              : oneCurrencyIsUSDT
                              ? approveCCallback
                              : approveECallback
                          }
                          disabled={checkAPendingApprove()}
                          width={checkBApprove() ? '48%' : '100%'}
                        >
                          {checkAPendingApprove() ? (
                            <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                          ) : (
                            'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                      {checkBApprove() && (
                        <ButtonPrimary
                          onClick={
                            oneCurrencyIsWETH || oneCurrencyIsETH
                              ? approveBCallback
                              : oneCurrencyIsUSDT
                              ? approveDCallback
                              : approveFCallback
                          }
                          disabled={checkBPendingApprove()}
                          width={checkAApprove() ? '48%' : '100%'}
                        >
                          {checkBPendingApprove() ? (
                            <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                          ) : (
                            'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                    </RowBetween>
                  )}
                <ButtonError
                  onClick={() => {
                    expertMode ? onAdd() : setShowConfirm(true)
                  }}
                  disabled={!isValid || checkAApprove() || checkBApprove()}
                  error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {error ?? 'Supply'}
                  </Text>
                </ButtonError>
              </AutoColumn>
            )}
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
