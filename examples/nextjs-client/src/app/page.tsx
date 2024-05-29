'use client'

import { SessionContext } from "@/context";
import { useContext } from "react";
import Image from 'next/image';
import images from "@/assets";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {

  const { isSubscribed, walletAddress } = useContext(SessionContext);

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen bg-gray-300">
      <ConnectButton />
      { walletAddress && isSubscribed === true ? (
          <div className='flex flex-col h-96 w-96 items-center py-8 gap-y-4'>
            <h1 className='text-4xl text-green-500'>Success!</h1>
            <Image 
              src={images.Success}
              alt="success"
              height={200}
              width={200}
            />
            <ConnectButton />
          </div>
        ): walletAddress && isSubscribed === false ? (
          <div className='flex flex-col h-96 w-96 items-center py-8 gap-y-4'>
            <h1 className='text-4xl text-red-500'>Invalid</h1>
            <Image 
              src={images.Invalid}
              alt="invalid"
              height={200}
              width={200}
            />
          </div>
        ):null }

    </main>
  );
}