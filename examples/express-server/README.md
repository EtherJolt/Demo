Integration Demo: Creating User Auth Session

Introduction
This repository contains an example of an Express server that handles user sessions using [SIWE (Sign-In with Ethereum)](https://siwe.dev/). 
The example uses a public client to interact with a subscription ledger smart contract and check if the user is subscribed to a specific service.

## Features

- Generate nonce for user authentication.
- Handle user login and session creation.
- Validate user subscription status.
- Middleware for SIWE signature validation.

## Prerequisites

To get started, you'll need to have the following dependencies installed:

- Node.js
- npm
- TypeScript
- viem (https://viem.sh/)

## Usage

To check a user's payment status, you need to configure the public client and call the readContract method with the appropriate parameters. The result will indicate whether the user has paid to subscribe to a service, and if their subscription is still active. This logic can be used to determine the level of user privelege.

Configuration Parameters

    chainId: The ID of the blockchain network.
    address: The address of the user.
    batch: Smart Contract Service Batch - assigned upon service activation (specific to an active service).
    serviceId: The ID of the service verifying connecting user. - assigned upon service activation (unique to each service)
    SubscriptionLedgerAbi: The ABI of the Subscription Ledger smart contract.

## Setup

### User Signs Login Message

In a client, or context outside of this server, the user must sign a message
using the private key of their wallet. 

For more details on how to collect a user's signature, see: 
	[SIWE (Sign-In with Ethereum)](https://siwe.dev/)

### Create User Session

Once the user has signed a message to signin. Verify that Signature and create a user session. 

	const siweMessage = new SiweMessage(req.body.message);
    const sessionNonce = req.session.nonce.value;
    const result = await siweMessage.verify({
      signature: req.body.signature, /// signature to verify
      domain: process.env.APP_DOMAIN,
      nonce: sessionNonce, 
    });

The response of the section below will indicate whether the connecting user has paid, and their payment is still valid.

	const chainId = sepolia.id; // update network to suit use
	const batch = BigInt(process.env.BATCH!);
	const serviceId = Number(process.env.SERVICE_ID)
	const publicClient = createPublicClient({
	  chain: NetworkUtils.chainById(chainId),
	  transport: http(), 
	  batch:{ multicall: true },
	});
	return publicClient.readContract({
	  address: NetworkUtils.getSubLedger(chainId),
	  abi: SubscriptionLedgerAbi,
	  functionName: 'isSubscribed',
	  args: [address, batch, serviceId]
	})