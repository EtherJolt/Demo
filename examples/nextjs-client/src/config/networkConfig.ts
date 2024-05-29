import { foundry, sepolia } from 'viem/chains';
import type { ActiveChain, Address } from '@/types';

export const supportedNetworkIds = [foundry.id, sepolia.id] as const;

export const enabledNetworks: ActiveChain[] = [{
	chainId: foundry.id,
	name: 'Foundry',
	chain: foundry,
	SubscriptionLedger: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0" as Address
},
{
	chainId: sepolia.id,
	name: 'Sepolia',
	chain: sepolia,
	SubscriptionLedger: "0x1181B3fF8eD68ca13820c7c8861De6ad77457E48" as Address,
}];