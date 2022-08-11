# liquidity.dfi.dev

## The DeFiChain DFI Liquidity Mining Program

DeFiChain has allocated one million DFI tokens from a [Community Funding Proposal](https://github.com/DeFiCh/dfips/issues/186) to incentivize liquidity mining for the DFI/ETH, DFI/USDT, and the new DFI/USDC pair on Uniswap, and to increase the utility of ERC-20 DFI.

To participate in the liquidity mining program, liquidity providers can do so through a dedicated dApp at [`liquidity.dfi.dev`](https://liquidity.dfi.dev/).

For more information, check out the [FAQs](https://birthdayresearch.notion.site/DFI-Liquidity-Mining-Program-1696a9cb66fd4fc38d9ccf14c782cba0#b9abfb7103464d148bcf5a2572c9f624).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"`

Note that the interface only works on testnets where both
[Uniswap V2](https://uniswap.org/docs/v2/smart-contracts/factory/) and
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Accessing Uniswap Interface V1

The Uniswap Interface supports swapping against, and migrating or removing liquidity from Uniswap V1. However,
if you would like to use Uniswap V1, the Uniswap V1 interface for mainnet and testnets is accessible via IPFS gateways
linked from the [v1.0.0 release](https://github.com/Uniswap/uniswap-interface/releases/tag/v1.0.0).

## Acknowledgements

This repository is a fork of Uniswap's [interface](https://github.com/Uniswap/interface).