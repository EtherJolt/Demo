'use client';

import '@rainbow-me/rainbowkit/styles.css';
import '@/styles/global.css'

import { 
  WalletContext, 
  SessionProvider, 
} from '@/context';

import Head from 'next/head';
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      {/* SEO */}
      <Head>
          <title>Demo</title>
          <meta name="description" content="EtherJolt Pass" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <body className={inter.className}>
        <WalletContext>
            <SessionProvider>
              {children}
            </SessionProvider>
        </WalletContext>
      </body>
    </html>
  );
}
