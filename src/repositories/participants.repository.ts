
import {
    and,
    count,
    desc,
    eq,
    ilike,
    inArray,
  } from "drizzle-orm";
  
  import { db } from "../db/index.js";
  
  import { jogadores } from "../db/schema/jogadores.js";
  import { duplas } from "../db/schema/duplas.js";
  import { duplaJogadores } from "../db/schema/duplaJogadores.js";
  import { teamMemberRoleEnum } from "../db/schema/enums.js";
  
  type TeamMemberRole =
    (typeof teamMemberRoleEnum.enumValues)[number];
  
  type DuoMemberData = {
    jogadorId: string;
    papel: TeamMemberRole;
  };
  
  // ========================================
  // JOGADORES
  // ========================================
  
  export async function findPlayerById(id: string) {
    const [player] = await db
      .select()
      .from(jogadores)
      .where(eq(jogadores.id, id))
      .limit(1);
  
    return player ?? null;
  }
  
  export async function findPlayerByUserId(userId: string) {
    const [player] = await db
      .select()
      .from(jogadores)
      .where(eq(jogadores.usuarioId, userId))
      .limit(1);
  
    return player ?? null;
  }
  
  export async function findPlayersByIds(ids: string[]) {
    if (ids.length === 0) return [];
  
    return db
      .select()
      .from(jogadores)
      .where(inArray(jogadores.id, ids));
  }
  
  export async function createPlayer(data: {
    usuarioId: string;
    apelido: string;
    fotoUrl?: string | null;
    cidade?: string | null;
    estado?: string | null;
  }) {
    const [player] = await db
      .insert(jogadores)
      .values({
        usuarioId: data.usuarioId,
        apelido: data.apelido,
        fotoUrl: data.fotoUrl,
        cidade: data.cidade,
        estado: data.estado,
      })
      .returning();
  
    if (!player) {
      throw new Error("Não foi possível criar o jogador.");
    }
  
    return player;
  }
  
  export async function updatePlayerById(
    id: string,
    data: {
      apelido?: string;
      fotoUrl?: string | null;
      cidade?: string | null;
      estado?: string | null;
    }
  ) {
    const [player] = await db
      .update(jogadores)
      .set({
        ...data,
        atualizadoEm: new Date(),
      })
      .where(eq(jogadores.id, id))
      .returning();
  
    return player ?? null;
  }
  
  export async function listPlayers(options: {
    limit: number;
    offset: number;
    search?: string;
  }) {
    const { limit, offset, search } = options;
  
    if (search) {
      return db
        .select()
        .from(jogadores)
        .where(ilike(jogadores.apelido, `%${search}%`))
        .orderBy(desc(jogadores.criadoEm))
        .limit(limit)
        .offset(offset);
    }
  
    return db
      .select()
      .from(jogadores)
      .orderBy(desc(jogadores.criadoEm))
      .limit(limit)
      .offset(offset);
  }
  
  export async function countPlayers(search?: string) {
    const [result] = search
      ? await db
          .select({ total: count() })
          .from(jogadores)
          .where(ilike(jogadores.apelido, `%${search}%`))
      : await db
          .select({ total: count() })
          .from(jogadores);
  
    return Number(result?.total ?? 0);
  }
  
  // ========================================
  // DUPLAS
  // ========================================
  
  export async function findDuoById(id: string) {
    const [duo] = await db
      .select()
      .from(duplas)
      .where(eq(duplas.id, id))
      .limit(1);
  
    return duo ?? null;
  }
  
  export async function listDuos(options: {
    limit: number;
    offset: number;
    search?: string;
  }) {
    const { limit, offset, search } = options;
  
    if (search) {
      return db
        .select()
        .from(duplas)
        .where(ilike(duplas.nome, `%${search}%`))
        .orderBy(desc(duplas.criadaEm))
        .limit(limit)
        .offset(offset);
    }
  
    return db
      .select()
      .from(duplas)
      .orderBy(desc(duplas.criadaEm))
      .limit(limit)
      .offset(offset);
  }
  
  export async function countDuos(search?: string) {
    const [result] = search
      ? await db
          .select({ total: count() })
          .from(duplas)
          .where(ilike(duplas.nome, `%${search}%`))
      : await db
          .select({ total: count() })
          .from(duplas);
  
    return Number(result?.total ?? 0);
  }
  
  export async function listDuoMembers(duoIds: string[]) {
    if (duoIds.length === 0) return [];
  
    return db
      .select({
        duplaId: duplaJogadores.duplaId,
        jogadorId: jogadores.id,
        apelido: jogadores.apelido,
        fotoUrl: jogadores.fotoUrl,
        cidade: jogadores.cidade,
        estado: jogadores.estado,
        status: jogadores.status,
        papel: duplaJogadores.papel,
        adicionadoEm: duplaJogadores.adicionadoEm,
      })
      .from(duplaJogadores)
      .innerJoin(
        jogadores,
        eq(duplaJogadores.jogadorId, jogadores.id)
      )
      .where(inArray(duplaJogadores.duplaId, duoIds));
  }
  
  // ========================================
  // TRANSAÇÕES DE DUPLAS
  // ========================================
  
  export async function createDuoWithMembers(data: {
    nome: string;
    criadorUsuarioId: string;
    jogadores: DuoMemberData[];
  }) {
    return db.transaction(async (tx) => {
      const [duo] = await tx
        .insert(duplas)
        .values({
          nome: data.nome,
          criadorUsuarioId: data.criadorUsuarioId,
        })
        .returning();
  
      if (!duo) {
        throw new Error("Não foi possível criar a dupla.");
      }
  
      await tx
        .insert(duplaJogadores)
        .values(
          data.jogadores.map((member) => ({
            duplaId: duo.id,
            jogadorId: member.jogadorId,
            papel: member.papel,
          }))
        );
  
      return duo;
    });
  }
  
  export async function updateDuoName(
    id: string,
    nome: string
  ) {
    const [duo] = await db
      .update(duplas)
      .set({ nome })
      .where(eq(duplas.id, id))
      .returning();
  
    return duo ?? null;
  }
  
  export async function replaceDuoMembers(
    duoId: string,
    members: DuoMemberData[]
  ) {
    await db.transaction(async (tx) => {
      await tx
        .delete(duplaJogadores)
        .where(eq(duplaJogadores.duplaId, duoId));
  
      await tx
        .insert(duplaJogadores)
        .values(
          members.map((member) => ({
            duplaId: duoId,
            jogadorId: member.jogadorId,
            papel: member.papel,
          }))
        );
    });
  }
  