import { Request, Response, NextFunction } from 'express';
import { SiweMessage } from 'siwe';

/**
 * Siwe Signature Validation
 *  check validity of session attached to incoming request
 */
export async function validateSignature(
  req:Request, 
  res:Response, 
  next: NextFunction
){
  try{
    if (
      !req.session ||
      !req.session.nonce ||
      !req.session.user ||
      !req.session.user.signature ||
      !req.session.user.siwe
    ) {
      return res.status(401).json({ message: "Session Invalid" })
    }

    const siweMessage = new SiweMessage(req.session.user.siwe);
    const result = await siweMessage.verify({
      signature: req.session?.user.signature,
      domain: process.env.APP_DOMAIN,
      nonce: req.session.nonce.value,
    });

    if (!result.success) { 
      return res.status(401).json({ message: "Session Invalid" })
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}