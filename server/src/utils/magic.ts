// src/utils/magic.ts
import { Magic } from "@magic-sdk/admin";

export const magic = new Magic(process.env.MAGIC_SECRET_KEY!);
