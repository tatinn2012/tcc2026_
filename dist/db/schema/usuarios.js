import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { userStatusEnum } from "./enums.js";
export const usuarios = pgTable("usuarios", {
    id: uuid("id").defaultRandom().primaryKey(),
    nome: varchar("nome", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    /** Hash forte gerado no servidor. Nunca armazene senha em texto puro. */
    senhaHash: text("senha_hash"),
    status: userStatusEnum("status").notNull().default("PENDING"),
    criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    uniqueIndex("usuarios_email_lower_unique").on(sql `lower(${table.email})`),
]);
//# sourceMappingURL=usuarios.js.map