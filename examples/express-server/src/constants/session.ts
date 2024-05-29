import { SessionNonce, SessionUser } from "../types"

declare module 'express-session' {
  interface SessionData {
    nonce: SessionNonce,
    user: SessionUser
  }
}