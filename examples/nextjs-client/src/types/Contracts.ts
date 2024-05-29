import type { Address, SupportedChain } from "@/types"
import type { Chain } from "viem";

export type NetworkInfo = {
  chainId: SupportedChain,
  address: Address
}

export type ActiveChain = {
  chainId: SupportedChain,
  name: string,
  chain: Chain
  SubscriptionLedger: Address,
}