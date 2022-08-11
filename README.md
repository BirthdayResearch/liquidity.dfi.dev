# The DeFiChain DFI Liquidity Mining Program

[![Netlify Status](https://api.netlify.com/api/v1/badges/c6e3e43b-5770-47b2-bf58-386b0044beb3/deploy-status)](https://app.netlify.com/sites/liquidity-dfi/deploys)

DeFiChain has allocated one million DFI tokens from a [Community Funding Proposal](https://github.com/DeFiCh/dfips/issues/186) to incentivize liquidity mining for the DFI/ETH, DFI/USDT, and the new DFI/USDC pair on Uniswap, and to increase the utility of ERC-20 DFI.

To participate in the liquidity mining program, liquidity providers can do so through a dedicated dApp at [`liquidity.dfi.dev`](https://liquidity.dfi.dev/).

For more information, check out the [FAQs](https://birthdayresearch.notion.site/DFI-Liquidity-Mining-Program-1696a9cb66fd4fc38d9ccf14c782cba0#b9abfb7103464d148bcf5a2572c9f624).

## Contract Addresses

This dApp interacts with the following `Liquidity Mining Contract` addresses. The `Liquidity Mining Contract` will then pass on the liquidity provided to the `Uniswap Pool` contract respectively.

| Name                               | Contract                                                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| DFI/ETH Liquidity Mining Contract  | [0x743c5b2f134290741b6de9c330d5a2ff43c773d3](https://etherscan.io/address/0x743c5b2f134290741b6de9c330d5a2ff43c773d3) |
| DFI/ETH Uniswap Pool               | [0xb079d6be3faf5771e354586dbc47d0a3d37c34fb](https://etherscan.io/address/0xb079d6be3faf5771e354586dbc47d0a3d37c34fb) |
| DFI/USDT Liquidity Mining Contract | [0xc13a1f46b58fce16c3a583df8e26bbef1a497ad2](https://etherscan.io/address/0xc13a1f46b58fce16c3a583df8e26bbef1a497ad2) |
| DFI/USDT Uniswap Pool              | [0x9e251daeb17981477509779612dc2ffa8075aa8e](https://etherscan.io/address/0x9e251daeb17981477509779612dc2ffa8075aa8e) |
| DFI/USDC Liquidity Mining Contract | [0x8cc61dfd87b256ce2be3da9ffa98ede3f018fa0e](https://etherscan.io/address/0x8cc61dfd87b256ce2be3da9ffa98ede3f018fa0e) |
| DFI/USDC Uniswap Pool              | [0xd239216ac7e44a09da67d6852cd757fc5e829fe2](https://etherscan.io/address/0xd239216ac7e44a09da67d6852cd757fc5e829fe2) |

Also included in the table below are links to the Uniswap pool analytics. You can lookup `Add` or `Remove` liquidity events by filtering with the above `Liquidity Mining Contract` addresses.

| Name                       | URL                                                                         |
| -------------------------- | --------------------------------------------------------------------------- |
| DFI/ETH Uniswap Analytics  | https://v2.info.uniswap.org/pair/0xb079d6be3faf5771e354586dbc47d0a3d37c34fb |
| DFI/USDT Uniswap Analytics | https://v2.info.uniswap.org/pair/0x9e251daeb17981477509779612dc2ffa8075aa8e |
| DFI/USDC Uniswap Analytics | https://v2.info.uniswap.org/pair/0xd239216ac7e44a09da67d6852cd757fc5e829fe2 |

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
