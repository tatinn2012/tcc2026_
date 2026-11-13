import { eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { usuarios } from "../db/schema/usuarios.js";
export async function findByEmail(email) {
    const [user] = await db
        .select()
        .from(usuarios)
        .where(sql `lower(${usuarios.email}) = ${email.toLowerCase()}`)
        .limit(1);
    return user ?? null;
}
export async function findById(id) {
    const [user] = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.id, id))
        .limit(1);
    return user ?? null;
}
export async function create(data) {
    const [user] = await db
        .insert(usuarios)
        .values({
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        status: "ACTIVE",
    })
        .returning();
    if (!user) {
        throw new Error("Não foi possível cadastrar o usuário.");
    }
    return user;
}
export async function updateName(id, nome) {
    const [user] = await db
        .update(usuarios)
        .set({
        nome,
        atualizadoEm: new Date(),
    })
        .where(eq(usuarios.id, id))
        .returning();
    return user ?? null;
}
//# sourceMappingURL=users.repository.js.map