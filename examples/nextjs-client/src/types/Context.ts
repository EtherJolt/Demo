import type { Address } from "@/types";

export type ISessionContext = {
	handleDisconnect: () => void,
	walletAddress: Address | null
	isSubscribed: boolean | null
}