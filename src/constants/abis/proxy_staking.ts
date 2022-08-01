import { Interface } from '@ethersproject/abi'
import PROXY_ABI from './usdc-lp-proxy.json'
const PROXY_INTERFACE = new Interface(PROXY_ABI)

export default PROXY_INTERFACE
export { PROXY_ABI }
