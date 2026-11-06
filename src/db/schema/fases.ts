import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, integer, timestamp, uniqueIndex, check } from "drizzle-orm/pg-core";
import { torneios } from "./torneios";
import { stageTypeEnum, stageStatusEnum } from "./enums";

export const fases = pgTable("fases", {
  id: uuid("id").defaultRandom().primaryKey(),
  torneioId: uuid("torneio_id").notNull().references(() => torneios.id, { onDelete: "cascade" }),
  nome: varchar("nome", { length: 60 }).notNull(),
  tipo: stageTypeEnum("tipo").notNull().default("CUSTOM"),
  ordem: integer("ordem").notNull(),
  status: stageStatusEnum("status").notNull().default("PENDING"),
  criadaEm: timestamp("criada_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("fases_torneio_ordem_unique").on(table.torneioId, table.ordem),
  check("fases_ordem_check", sql`${table.ordem} >= 1`),
]);
