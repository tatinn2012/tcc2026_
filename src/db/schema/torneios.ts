import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, integer, timestamp, uniqueIndex, index, check } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios.js";
import { regrasTruco } from "./regrasTruco.js";
import { tournamentFormatEnum, tournamentStatusEnum } from "./enums.js";

export const torneios = pgTable("torneios", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizadorUsuarioId: uuid("organizador_usuario_id").notNull().references(() => usuarios.id, { onDelete: "restrict" }),
  regrasId: uuid("regras_id").notNull().references(() => regrasTruco.id, { onDelete: "restrict" }),
  nome: varchar("nome", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull(),
  descricao: text("descricao"),
  formato: tournamentFormatEnum("formato").notNull().default("SINGLE_ELIMINATION"),
  status: tournamentStatusEnum("status").notNull().default("DRAFT"),
  limiteDuplas: integer("limite_duplas").notNull().default(8),
  inscricoesAbremEm: timestamp("inscricoes_abrem_em", { withTimezone: true }),
  inscricoesEncerramEm: timestamp("inscricoes_encerram_em", { withTimezone: true }),
  inicioEm: timestamp("inicio_em", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("torneios_slug_unique").on(table.slug),
  index("torneios_organizador_idx").on(table.organizadorUsuarioId),
  index("torneios_status_idx").on(table.status),
  check("torneios_limite_duplas_check", sql`${table.limiteDuplas} >= 2`),
]);
