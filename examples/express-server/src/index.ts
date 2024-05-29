import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import { validateSignature } from './handlers/authMiddleware';
import { handleLogin, getNonce } from './handlers/login';

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(session({
  secret: 'super secret', 
  resave: false,
  saveUninitialized: true,
  cookie: { 
    // Set to true if using https
    secure: process.env.NODE_ENV === 'production' ? true : false, 
    
    httpOnly: process.env.NODE_ENV === 'production' ? true : false,
  } 
}));

// GET endpoint to getNonce
app.get('/getNonce', (req:Request, res:Response, next:NextFunction) => {
  req.session.nonce = getNonce();
  return res.json({ nonce:req.session.nonce });
});

// POST endpoint to receive data
app.post('/login', async (req:Request, res:Response, next:NextFunction) => {
  return await handleLogin(req, res);
});

app.get('/protected-route', validateSignature, (req:Request, res:Response, next:NextFunction) => {
  const user = req.session.user;
  if(!req.session.user || !req.session.user.access) return res.status(401).json({ message: "UNAUTHORIZED" })
  return 'data';
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});