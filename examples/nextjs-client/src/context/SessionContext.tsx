'use client';

import { createContext, useState, type ReactElement, type ReactNode } from 'react';
import { http, createPublicClient } from "viem";
import { useAccountEffect, useDisconnect } from 'wagmi'
import { sepolia } from 'viem/chains';

import type { Address, ISessionContext } from "@/types";

import config from '@/config/wagmiConfig';
import { SubscriptionLedgerAbi } from '@/constants/abi';
import NetworkUtils from '@/lib/NetworkUtils';

export const SessionContext = createContext<ISessionContext>({} as ISessionContext);
export const SessionProvider = ({ children }: { children: ReactNode }): ReactElement | null => {
  
  const batch = BigInt(0);
  const serviceId = 1 as const;

  const [connectedUser, setConnectedUser] = useState<Address|null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { disconnect } = useDisconnect({ config });

  function handleDisconnect(){
    disconnect();
    setConnectedUser(null);
    setIsSubscribed(false);
  }

  /** 
   * ``` Sign In user Action ```
   * Handle connected wallet account change. 
   */
  useAccountEffect({
    config,
    onDisconnect(){
      handleDisconnect();
    },
    onConnect({ address }) {
      try{
        if(!address) handleDisconnect()
        setConnectedUser(address); /// update ref to deliver value to controls

        /** Create client to execute request to smart contract on target network*/
        const chainId = sepolia.id;
        const publicClient = createPublicClient({
          chain: NetworkUtils.chainById(chainId),
          transport: http(),
          batch:{ multicall: true },
        });

        /** Execute request, Determine user subscription status */
        publicClient.readContract({
          address: NetworkUtils.getSubLedger(chainId),
          abi: SubscriptionLedgerAbi,
          functionName: 'isSubscribed',
          args: [address, batch, serviceId]
        })
        .then((result:boolean)=>{
          /// flash result
          console.log('Check result:::', result)
          setIsSubscribed(result);
        })
        .catch((err)=>{
          console.warn(err)
        });
      } catch(err) {
        setIsSubscribed(false)
        // isSubscribed.current = false;
        console.error(err);
      }
    },
  });

  return (
    <SessionContext.Provider 
      value={{ 
        handleDisconnect,
        walletAddress: connectedUser,
        isSubscribed: isSubscribed
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}