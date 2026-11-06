import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";
import { teamStatusEnum } from "./enums";

export const duplas = pgTable("duplas", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: varchar("nome", { length: 80 }).notNull(),
  criadorUsuarioId: uuid("criador_usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  status: teamStatusEnum("status").notNull().default("ACTIVE"),
  criadaEm: timestamp("criada_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("duplas_criador_idx").on(table.criadorUsuarioId)]);
