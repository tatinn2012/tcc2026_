import { pgTable, uuid, varchar, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";
import { playerStatusEnum } from "./enums";

export const jogadores = pgTable("jogadores", {
  id: uuid("id").defaultRandom().primaryKey(),
  usuarioId: uuid("usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  apelido: varchar("apelido", { length: 60 }).notNull(),
  fotoUrl: text("foto_url"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  status: playerStatusEnum("status").notNull().default("ACTIVE"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("jogadores_usuario_unique").on(table.usuarioId),
  index("jogadores_apelido_idx").on(table.apelido),
]);
