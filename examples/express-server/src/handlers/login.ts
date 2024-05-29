import { Request, Response } from 'express';
import { SiweMessage } from 'siwe';
import { Address } from '../types';
import { sepolia } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { SubscriptionLedgerAbi } from '../constants/abi';
import NetworkUtils from '../lib/NetworkUtils';

// GET endpoint to getNonce
export function getNonce(){
  const currentDate = Date.now()
  return {
    value: Math.floor(Math.random() * 1000000).toString(36).substr(2, 8), /// generate random nonce value
    iat: currentDate,
    exp: currentDate + 5 * 60 * 1000// 5 minutes 
  };
} 

export async function handleLogin(req:Request, res:Response){
  try{
    if(!req.session.nonce || req.session.nonce.exp > Date.now()){
      return res.status(401).json({ message: 'Expired' })
    }
    
    const siweMessage = new SiweMessage(req.body.message);
    const sessionNonce = req.session.nonce.value;
    const result = await siweMessage.verify({
      signature: req.body.signature, /// verify signature
      domain: process.env.APP_DOMAIN,
      nonce: sessionNonce, // include session specific nonce which was included in signature on client
    });

    if (!result.success) {
      return res.status(401).json({ message: 'Invalid Message' })
    }

    req.session.user = {
      siwe: siweMessage,
      signature: req.body.signature,
      access: await checkSubscriptionStatus(siweMessage.address as Address)
    }

    return res.status(200).json({ message: 'Data received successfully' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * Payment Validation
 *  User Session user address to execute rpc request.
 *  Result indicates user session privelege
 * 
 * The result of this http request to a JSON-RPC endpoint
 *  indicates the user's level of access
 * 
 * The result can be stored in a secure sever session to reduce load
 */
export async function checkSubscriptionStatus(address: Address):Promise<boolean>{
  try {

    const chainId = sepolia.id; // update network to suit use
    const batch = BigInt(process.env.BATCH!);
    const serviceId = Number(process.env.SERVICE_ID)

    /// in a larger application, consider using a global instance
    const publicClient = createPublicClient({
      chain: NetworkUtils.chainById(chainId),
      transport: http(), /// for production environments, configure http() endpoint && request headers
      batch:{ multicall: true },
    });

    return publicClient.readContract({
      address: NetworkUtils.getSubLedger(chainId),
      abi: SubscriptionLedgerAbi,
      functionName: 'isSubscribed',
      args: [address as Address, batch, serviceId]
    })
  }catch(err){
    console.error('Auth Failed', err);
    throw new Error('Auth Failed')
  }
}