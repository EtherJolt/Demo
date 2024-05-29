import { createPublicClient, http } from 'viem'
import { expect, test } from 'vitest';
import { sepolia } from 'viem/chains';
import type { Address } from '@/types';
import NetworkUtils from "@/lib/NetworkUtils";
import { SubscriptionLedgerAbi } from '@/constants/abi';

const chainId = sepolia.id;
const batch = BigInt(0); /// uint256
const batchIndex = 1; /// uint8
const publicClient = createPublicClient({
    transport: http(),
    chain: sepolia,
  });

test('user is subscribed', async () => {

	const SUBSCRIBED_USER = process.env.SUBSCRIBED_USER as Address;

	const batch = BigInt(0); /// uint256
	const batchIndex = 1; /// uint8
	const isSubscribed = await publicClient.readContract({
		address: NetworkUtils.getSubLedger(chainId),
		abi: SubscriptionLedgerAbi,
		functionName: 'isSubscribed',
		args: [SUBSCRIBED_USER, batch, batchIndex]
	});

	console.log('isSubscribed', isSubscribed)
	expect(isSubscribed).toBeTruthy();
})

test('user is not subscribed', async () => {

	const NOT_SUBSCRIBED_USER = process.env.NOT_SUBSCRIBED_USER as Address;

	const isSubscribed = await publicClient.readContract({
		address: NetworkUtils.getSubLedger(chainId),
		abi: SubscriptionLedgerAbi,
		functionName: 'isSubscribed',
		args: [NOT_SUBSCRIBED_USER, batch, batchIndex]
	});

	console.log('isSubscribed', isSubscribed)
	expect(isSubscribed).not.toBeTruthy();
})