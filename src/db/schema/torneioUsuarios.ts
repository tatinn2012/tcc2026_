import { pgTable, uuid, timestamp, primaryKey, index } from "drizzle-orm/pg-core";
import { torneios } from "./torneios";
import { usuarios } from "./usuarios";
import { tournamentStaffRoleEnum } from "./enums";

export const torneioUsuarios = pgTable("torneio_usuarios", {
  torneioId: uuid("torneio_id").notNull().references(() => torneios.id, { onDelete: "cascade" }),
  usuarioId: uuid("usuario_id").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  permissao: tournamentStaffRoleEnum("permissao").notNull(),
  concedidaEm: timestamp("concedida_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.torneioId, table.usuarioId] }),
  index("torneio_usuarios_usuario_idx").on(table.usuarioId),
]);
