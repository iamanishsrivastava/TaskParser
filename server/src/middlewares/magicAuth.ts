// middleware/magicAuth.ts
import type { Request, Response, NextFunction } from "express";
import { magic } from "../utils/magic.ts";
import { db } from "../utils/db.mts";

export const magicAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or malformed authorization header" });
  }
  const token = authHeader.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const metadata = await magic.users.getMetadataByToken(token);
    if (!metadata.issuer)
      return res.status(401).json({ error: "Invalid token" });

    req.user = {
      id: metadata.issuer,
      issuer: metadata.issuer,
      email: metadata.email,
      publicAddress: metadata.publicAddress,
    };

    // Auto-create user in DB if not exists
    await db.query(
      `INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [metadata.issuer, metadata.email]
    );

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
