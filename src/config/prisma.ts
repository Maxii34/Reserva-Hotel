import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "Falta la variable de entorno DATABASE_URL. Definila en tu archivo .env"
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

// Reutiliza pool y cliente en dev (tsx watch recarga módulos y sin esto
// cada reload abre un Pool nuevo y cuelga conexiones).
const pool = globalThis.__pgPool ?? new Pool({ connectionString });
if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalThis.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
