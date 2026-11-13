import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, integer, boolean, primaryKey, check, uniqueIndex } from "drizzle-orm/pg-core";
import { regrasTruco } from "./regrasTruco.js";
import { cartas } from "./cartas.js";

/** A força é específica da versão das regras, não do catálogo global da carta. */
export const forcaCartas = pgTable("forca_cartas", {
  regrasId: uuid("regras_id").notNull().references(() => regrasTruco.id, { onDelete: "cascade" }),
  cartaId: smallint("carta_id").notNull().references(() => cartas.id, { onDelete: "restrict" }),
  forca: integer("forca").notNull(),
  ehManilha: boolean("eh_manilha").notNull().default(false),
  ordemManilha: smallint("ordem_manilha"),
}, (table) => [
  primaryKey({ columns: [table.regrasId, table.cartaId] }),
  uniqueIndex("forca_cartas_ordem_manilha_unique").on(table.regrasId, table.ordemManilha),
  check("forca_cartas_manilha_ordem_check", sql`(${table.ehManilha} = true AND ${table.ordemManilha} BETWEEN 1 AND 4) OR (${table.ehManilha} = false AND ${table.ordemManilha} IS NULL)`),
]);
