import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}
