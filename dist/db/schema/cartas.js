import { pgTable, smallint, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { cardRankEnum, cardSuitEnum } from "./enums.js";
/** Catálogo estático das 40 cartas. Execute um seed inicial após a migration. */
export const cartas = pgTable("cartas", {
    id: smallint("id").generatedAlwaysAsIdentity().primaryKey(),
    codigo: varchar("codigo", { length: 3 }).notNull(), // Ex.: 4C, 7H, AS
    valor: cardRankEnum("valor").notNull(),
    naipe: cardSuitEnum("naipe").notNull(),
}, (table) => [
    uniqueIndex("cartas_codigo_unique").on(table.codigo),
    uniqueIndex("cartas_valor_naipe_unique").on(table.valor, table.naipe),
]);
//# sourceMappingURL=cartas.js.map