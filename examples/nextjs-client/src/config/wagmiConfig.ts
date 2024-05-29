'use client';

import { http } from "viem";
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import {
  injectedWallet,
  metaMaskWallet,
  phantomWallet,
  rabbyWallet
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig } from 'wagmi';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Available',
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        phantomWallet,
        injectedWallet, 
      ],
    },
  ],
  {
    appName: process.env.NEXT_PUBLIC_APP_NAME!,
    projectId:  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  }
);


const config = createConfig({
  ssr: false, // If your dApp uses server side rendering (SSR)
  connectors,
  chains: [sepolia],
  transports:{
    [sepolia.id]: http(),
  },
});

export default config;