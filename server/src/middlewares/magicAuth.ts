// src/middlewares/magicAuth.ts
import type { Request, Response, NextFunction } from "express";
import { magic } from "../utils/magic";
import { db } from "../utils/db.mts";

export const magicAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Support both: Bearer token from header OR session from cookie
  const headerToken = req.headers.authorization?.split("Bearer ")[1];
  const cookieToken = req.cookies.session;
  const token = headerToken || cookieToken;

  // console.log("Middleware received token:", token);

  if (!token) {
    console.log("Middleware: Missing token");
    res.status(401).json({ error: "Missing token" });
    return;
  }

  try {
    const metadata = await magic.users.getMetadataByToken(token);

    if (!metadata?.issuer) {
      console.log("Middleware: Invalid token (no issuer)");
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // Attach user to request
    req.user = {
      id: metadata.issuer,
      issuer: metadata.issuer,
      email: metadata.email,
      publicAddress: metadata.publicAddress,
    };

    // Auto-create user if not exists
    await db.query(
      `INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [metadata.issuer, metadata.email]
    );

    next();
  } catch (err) {
    console.error("Middleware Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
