
import ws from "ws";

import {
  Pool,
  neonConfig,
} from "@neondatabase/serverless";

import {
  drizzle,
} from "drizzle-orm/neon-serverless";

import { sql } from "drizzle-orm";

import * as schema from "./schema.js";

import { env } from "../config/env.js";

// Configuração WebSocket para Node.js
neonConfig.webSocketConstructor = ws;

// Pool de conexões Neon
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 5,
});

// Instância principal do Drizzle
export const db = drizzle({
  client: pool,
  schema,
});

// Testa a conexão com PostgreSQL
export async function checkDatabaseConnection(): Promise<void> {
  await db.execute(sql`SELECT 1`);
}

// Encerra as conexões
export async function closeDatabase(): Promise<void> {
  await pool.end();
}

// Tipo para utilizar em outros módulos
export type Database = typeof db;
