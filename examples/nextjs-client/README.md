Integration Demo: Validating User Payment Status

This repository demonstrates how to validate a user's payment status when they connect to an application using a smart wallet. The example uses a public client to interact with a subscription ledger smart contract and check if the user is subscribed to a specific service.
Table of Contents

    Introduction
    Setup
    Usage
    Example Code

Introduction

	In this demo, we show how to use a public wallet client to read from a smart contract to valadate user authentication status.

Setup

To get started, you'll need to have the following dependencies installed:

	QueryClient
		- @tanstack/react-query
    Wallet Clients
    	- viem (https://viem.sh/)
    	- wagmi (https://wagmi.sh/)
    Wallet connect UX
    	- rainbow kit (https://www.rainbowkit.com/)

Usage

To check a user's payment status, you need to configure the public client and call the readContract method with the appropriate parameters. The result will indicate whether the user has paid to subscribe to a service, and if their subscription is still active

Configuration Parameters

    chainId: The ID of the blockchain network.
    address: The address of the user.
    batch: Smart Contract Service Batch - assigned upon service activation (specific to an active service).
    serviceId: The ID of the service verifying connecting user. - assigned upon service activation (unique to each service)
    SubscriptionLedgerAbi: The ABI of the Subscription Ledger smart contract.

Example Code

Here is an example code snippet to check the subscription status of a user:

	import { createPublicClient } from 'your-blockchain-library';
	import NetworkUtils from '@/lib/NetworkUtils';
	import SubscriptionLedgerAbi from '@/constants/abi';

	// Function to check if a user is subscribed
	const checkUserSubscription = (chainId, address, batch, serviceId, setIsSubscribed) => {
	  const publicClient = createPublicClient({
	    chain: NetworkUtils.chainById(chainId),
	    transport: http(),
	    batch: { multicall: true },
	  });
	  // Execute request to determine user subscription status
	  publicClient.readContract({
	    address: NetworkUtils.getSubLedger(chainId),
	    abi: SubscriptionLedgerAbi,
	    functionName: 'isSubscribed',
	    args: [address, batch, serviceId],
	  })
	  .then((result: boolean) => {
	    console.log('Check result:::', result);
	    setIsSubscribed(result);
	  });
	};

Usage

	const chainId = 1; // Example chain ID
	const address = '0xUserAddress'; // Example user address
	const batch = 0; // Example batch parameter
	const serviceId = 1; // Example service ID
	checkUserSubscription(chainId, address, batch, serviceId, (isSubscribed) => {
	  console.log('User subscription status:', isSubscribed);
	});

Example Usage in a React Component
If you are using React, you can integrate this code snippet into a component as follows:

	import React, { useState, useEffect } from 'react';
	const SubscriptionChecker = ({ chainId, address, batch, serviceId }) => {
	  
	  const [isSubscribed, setIsSubscribed] = useState(false);
	  
	  useEffect(() => {
	    checkUserSubscription(chainId, address, batch, serviceId, setIsSubscribed);
	  }, [chainId, address, batch, serviceId]);
	  return (
	    <div>
	      {isSubscribed ? (
	        <p>User is subscribed.</p>
	      ) : (
	        <p>User is not subscribed.</p>
	      )}
	    </div>
	  );
	};
	
	export default SubscriptionChecker;
