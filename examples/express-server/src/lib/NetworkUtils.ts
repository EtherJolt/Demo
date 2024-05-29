import type { ActiveChain, SupportedChain } from "../types";
import {enabledNetworks} from "../config/networkConfig";

class NetworkUtils {
	
	chainById(chainId: number): ActiveChain['chain'] {
		const chain = enabledNetworks.find((chain) => chain.chainId == chainId)?.chain;
		if (!chain) throw new Error("network not supported");
		return chain;
	}

	getSubLedger(chainId: SupportedChain) {
		const contract = enabledNetworks.find((c)=> c.chainId === chainId)?.SubscriptionLedger;
		if(!contract) throw new Error('unsupported network');
		return contract;
	}
}

const utils = new NetworkUtils()
export default utils;