import { pgTable, uuid, integer, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";
import { torneios } from "./torneios.js";
import { duplas } from "./duplas.js";
import { usuarios } from "./usuarios.js";
import { registrationStatusEnum } from "./enums.js";

export const inscricoes = pgTable("inscricoes", {
  id: uuid("id").defaultRandom().primaryKey(),
  torneioId: uuid("torneio_id").notNull().references(() => torneios.id, { onDelete: "cascade" }),
  duplaId: uuid("dupla_id").notNull().references(() => duplas.id, { onDelete: "restrict" }),
  inscritoPorUsuarioId: uuid("inscrito_por_usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  status: registrationStatusEnum("status").notNull().default("PENDING"),
  seed: integer("seed"),
  inscritoEm: timestamp("inscrito_em", { withTimezone: true }).notNull().defaultNow(),
  confirmadoEm: timestamp("confirmado_em", { withTimezone: true }),
}, (table) => [
  uniqueIndex("inscricoes_torneio_dupla_unique").on(table.torneioId, table.duplaId),
  uniqueIndex("inscricoes_torneio_seed_unique").on(table.torneioId, table.seed),
  index("inscricoes_status_idx").on(table.status),
]);
