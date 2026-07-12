import { TokenPayload } from '../utils/generateTokens';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
