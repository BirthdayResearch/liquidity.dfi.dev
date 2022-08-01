import { Interface } from '@ethersproject/abi'
import ERC20_ABI from './erc20.json'
import ERC20_BYTES32_ABI from './erc20_bytes32.json'
import ETH_LP_ABI from './eth-lp-proxy.json'
import USDC_LP_ABI from './usdc-lp-proxy.json'
import USDT_LP_ABI from './usdt-lp-proxy.json'

const ERC20_INTERFACE = new Interface(ERC20_ABI)

const ERC20_BYTES32_INTERFACE = new Interface(ERC20_BYTES32_ABI)

const ETH_LP_ABI_INTERFACE = new Interface(ETH_LP_ABI)

const USDC_LP_ABI_INTERFACE = new Interface(USDC_LP_ABI)

const USDT_LP_ABI_INTERFACE = new Interface(USDT_LP_ABI)

export default ERC20_INTERFACE
export { ERC20_ABI, ERC20_BYTES32_INTERFACE, ERC20_BYTES32_ABI, ETH_LP_ABI_INTERFACE, USDC_LP_ABI_INTERFACE, USDT_LP_ABI_INTERFACE }
