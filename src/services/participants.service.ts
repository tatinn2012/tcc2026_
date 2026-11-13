
import { AppError } from "../shared/app-error.js";

import * as participantsRepository from "../repositories/participants.repository.js";

import { teamMemberRoleEnum } from "../db/schema/enums.js";

import type {
  CreatePlayerInput,
  UpdatePlayerInput,
  CreateDuoInput,
  UpdateDuoInput,
  ReplaceDuoMembersInput,
} from "../validators/participants.validation.js";

// ========================================
// HELPERS
// ========================================

function getDatabaseErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const candidate = error as {
    code?: string;
    cause?: unknown;
  };

  return (
    candidate.code ??
    getDatabaseErrorCode(candidate.cause)
  );
}

function validateDuoRoles(
  members: CreateDuoInput["jogadores"]
): void {
  const expectedRoles = teamMemberRoleEnum.enumValues;

  if (expectedRoles.length !== 2) {
    throw new AppError(
      500,
      "O enum de papéis precisa possuir exatamente dois valores.",
      "INVALID_TEAM_ROLE_CONFIGURATION"
    );
  }

  const receivedRoles = new Set(
    members.map((member) => member.papel)
  );

  if (
    receivedRoles.size !== 2 ||
    expectedRoles.some((role) => !receivedRoles.has(role))
  ) {
    throw new AppError(
      400,
      "A dupla precisa possuir um integrante de cada papel.",
      "INVALID_TEAM_MEMBERS"
    );
  }
}

async function validatePlayers(
  members: CreateDuoInput["jogadores"]
): Promise<void> {
  const ids = members.map((member) => member.jogadorId);

  const players = await participantsRepository.findPlayersByIds(ids);

  if (players.length !== 2) {
    throw new AppError(
      404,
      "Um ou mais jogadores não foram encontrados.",
      "PLAYERS_NOT_FOUND"
    );
  }

  if (players.some((player) => player.status !== "ACTIVE")) {
    throw new AppError(
      409,
      "Todos os integrantes precisam possuir perfis ativos.",
      "INACTIVE_PLAYER"
    );
  }
}

async function getDuoDetails(id: string) {
  const duo = await participantsRepository.findDuoById(id);

  if (!duo) {
    throw new AppError(
      404,
      "Dupla não encontrada.",
      "DUO_NOT_FOUND"
    );
  }

  const members =
    await participantsRepository.listDuoMembers([id]);

  return {
    ...duo,
    jogadores: members,
  };
}

async function ensureDuoOwnership(
  duoId: string,
  userId: string
) {
  const duo = await participantsRepository.findDuoById(duoId);

  if (!duo) {
    throw new AppError(
      404,
      "Dupla não encontrada.",
      "DUO_NOT_FOUND"
    );
  }

  if (duo.criadorUsuarioId !== userId) {
    throw new AppError(
      403,
      "Você não possui permissão para modificar esta dupla.",
      "FORBIDDEN"
    );
  }

  return duo;
}

// ========================================
// JOGADORES
// ========================================

export async function createPlayer(
  userId: string,
  input: CreatePlayerInput
) {
  const existingPlayer =
    await participantsRepository.findPlayerByUserId(userId);

  if (existingPlayer) {
    throw new AppError(
      409,
      "Esta conta já possui um perfil de jogador.",
      "PLAYER_PROFILE_ALREADY_EXISTS"
    );
  }

  try {
    return await participantsRepository.createPlayer({
      usuarioId: userId,
      ...input,
    });
  } catch (error) {
    if (getDatabaseErrorCode(error) === "23505") {
      throw new AppError(
        409,
        "Esta conta já possui um perfil de jogador.",
        "PLAYER_PROFILE_ALREADY_EXISTS"
      );
    }

    throw error;
  }
}

export async function getMyPlayer(userId: string) {
  const player =
    await participantsRepository.findPlayerByUserId(userId);

  if (!player) {
    throw new AppError(
      404,
      "Você ainda não possui um perfil de jogador.",
      "PLAYER_PROFILE_NOT_FOUND"
    );
  }

  return player;
}

export async function getPlayerById(id: string) {
  const player =
    await participantsRepository.findPlayerById(id);

  if (!player) {
    throw new AppError(
      404,
      "Jogador não encontrado.",
      "PLAYER_NOT_FOUND"
    );
  }

  return player;
}

export async function updateMyPlayer(
  userId: string,
  input: UpdatePlayerInput
) {
  const existingPlayer =
    await participantsRepository.findPlayerByUserId(userId);

  if (!existingPlayer) {
    throw new AppError(
      404,
      "Você ainda não possui um perfil de jogador.",
      "PLAYER_PROFILE_NOT_FOUND"
    );
  }

  const updatedPlayer =
    await participantsRepository.updatePlayerById(
      existingPlayer.id,
      input
    );

  if (!updatedPlayer) {
    throw new AppError(
      404,
      "Jogador não encontrado.",
      "PLAYER_NOT_FOUND"
    );
  }

  return updatedPlayer;
}

export async function listPlayers(options: {
  page: number;
  limit: number;
  search?: string;
}) {
  const offset = (options.page - 1) * options.limit;

  const [players, total] = await Promise.all([
    participantsRepository.listPlayers({
      limit: options.limit,
      offset,
      search: options.search,
    }),

    participantsRepository.countPlayers(options.search),
  ]);

  return {
    data: players,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
    },
  };
}

// ========================================
// DUPLAS
// ========================================

export async function createDuo(
  userId: string,
  input: CreateDuoInput
) {
  validateDuoRoles(input.jogadores);

  await validatePlayers(input.jogadores);

  const duo = await participantsRepository.createDuoWithMembers({
    nome: input.nome,
    criadorUsuarioId: userId,
    jogadores: input.jogadores,
  });

  return getDuoDetails(duo.id);
}

export async function getDuoById(id: string) {
  return getDuoDetails(id);
}

export async function listDuos(options: {
  page: number;
  limit: number;
  search?: string;
}) {
  const offset = (options.page - 1) * options.limit;

  const [duos, total] = await Promise.all([
    participantsRepository.listDuos({
      limit: options.limit,
      offset,
      search: options.search,
    }),

    participantsRepository.countDuos(options.search),
  ]);

  const members =
    await participantsRepository.listDuoMembers(
      duos.map((duo) => duo.id)
    );

  const membersByDuo = new Map<
    string,
    typeof members
  >();

  for (const member of members) {
    const current = membersByDuo.get(member.duplaId) ?? [];

    current.push(member);

    membersByDuo.set(member.duplaId, current);
  }

  return {
    data: duos.map((duo) => ({
      ...duo,
      jogadores: membersByDuo.get(duo.id) ?? [],
    })),

    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
    },
  };
}

export async function updateDuo(
  duoId: string,
  userId: string,
  input: UpdateDuoInput
) {
  await ensureDuoOwnership(duoId, userId);

  const updatedDuo =
    await participantsRepository.updateDuoName(
      duoId,
      input.nome
    );

  if (!updatedDuo) {
    throw new AppError(
      404,
      "Dupla não encontrada.",
      "DUO_NOT_FOUND"
    );
  }

  return getDuoDetails(duoId);
}

export async function replaceDuoMembers(
  duoId: string,
  userId: string,
  input: ReplaceDuoMembersInput
) {
  await ensureDuoOwnership(duoId, userId);

  validateDuoRoles(input.jogadores);

  await validatePlayers(input.jogadores);

  await participantsRepository.replaceDuoMembers(
    duoId,
    input.jogadores
  );

  return getDuoDetails(duoId);
}
