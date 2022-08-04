# Uniswap Interface

## Accessing the Uniswap Interface

To access the Uniswap Interface, use an IPFS gateway link from the
[latest release](https://github.com/Uniswap/uniswap-interface/releases/latest),
or visit [app.uniswap.org](https://app.uniswap.org).

## Listing a token

Please see the
[@uniswap/default-token-list](https://github.com/uniswap/default-token-list)
repository.

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

Following are the addresses on Goerli network:

dfiAddress: [0xe5442CC9BA0FF56E4E2Edae51129bF3A1b45d673](https://goerli.etherscan.io/address/0xe5442CC9BA0FF56E4E2Edae51129bF3A1b45d673)

musdtAddress: [0xcf46184A1dB0dB31b05d42Cba17a2389f969Db72](https://goerli.etherscan.io/address/0xcf46184A1dB0dB31b05d42Cba17a2389f969Db72)

musdcAddress: [0xD14C4C4a024f15318a393A43De3b7DD9ad0Ce565](https://goerli.etherscan.io/address/0xD14C4C4a024f15318a393A43De3b7DD9ad0Ce565)

DFI/USDT contract address: [0xdb01EE311F15E870eE44d882b6256944f3f3129f](https://goerli.etherscan.io/address/0xdb01EE311F15E870eE44d882b6256944f3f3129f)

DFI/USDC contract address: [0x1157A50B6ac97F2A5CD686998D0DdBEB5175927a](https://goerli.etherscan.io/address/0x1157A50B6ac97F2A5CD686998D0DdBEB5175927a)

DFI/ETH contract address: [0xAD1C0376A026c148438EE89E1AA8a55d83AD0250](https://goerli.etherscan.io/address/0xAD1C0376A026c148438EE89E1AA8a55d83AD0250)

USDT Mining contract address: [0x5fd39Bf6aE258351f453e55256B03085B34712f0](https://goerli.etherscan.io/address/0x5fd39Bf6aE258351f453e55256B03085B34712f0)

USDS Mining contract address: [0xABC0a27Fa5BB9f3E63CC0876614d9D83d3689ae2](https://goerli.etherscan.io/address/0xABC0a27Fa5BB9f3E63CC0876614d9D83d3689ae2)

ETH Mining contract address: [0x69736086d7FF64e67ba0090229c9cdc1056fE039](https://goerli.etherscan.io/address/0x69736086d7FF64e67ba0090229c9cdc1056fE039)
