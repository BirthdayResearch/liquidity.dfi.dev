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

dfiAddress: [0x1C0b966109152065b234692E2c18Ff75ecf89C45](https://goerli.etherscan.io/address/0x1C0b966109152065b234692E2c18Ff75ecf89C45)

musdtAddress: [0xc8042c992c9627dF9e84ddf57Bc6adc1AB9C3acd](https://goerli.etherscan.io/address/0xc8042c992c9627df9e84ddf57bc6adc1ab9c3acd)

DFI/USDT contract address:  [0x24186D91EA5fE6EB2dCCCC3249762d5B833939C7](https://goerli.etherscan.io/address/0x24186D91EA5fE6EB2dCCCC3249762d5B833939C7)

DFI/ETH contract address:  [0x005C7a559FAe06bE5E2f28680f986eeeb003fa52](https://goerli.etherscan.io/address/0x005C7a559FAe06bE5E2f28680f986eeeb003fa52)

USDT Mining contract address:  [0x7A5A990EBaC71e56538C9311A6E080fe6e6Cdf0A](https://goerli.etherscan.io/address/0x7A5A990EBaC71e56538C9311A6E080fe6e6Cdf0A)

ETH Mining contract address:  [0x964B2feE939aa623869c7380f4e83789f98b2e88](https://goerli.etherscan.io/address/0x964b2fee939aa623869c7380f4e83789f98b2e88)