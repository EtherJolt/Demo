import type { Request } from "express";
import type { SiweMessage } from 'siwe';
import { HexString } from './Base';

// export type RequestWithSession = Request & {
// 	session: SessionData
// }

export type SessionUser = {
	siwe: SiweMessage,
	signature: HexString,
	access: boolean
}

export type SessionNonce = {
	value: string,
	iat: number,
	exp:number,
}