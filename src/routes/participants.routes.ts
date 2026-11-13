
import { Router } from "express";

import * as participantsController from "../controllers/participants.controller.js";

import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validate.js";

import {
  createPlayerSchema,
  updatePlayerSchema,
  createDuoSchema,
  updateDuoSchema,
  replaceDuoMembersSchema,
} from "../validators/participants.validation.js";

const router = Router();

// ========================================
// JOGADORES
// ========================================

// Consultar próprio perfil
router.get(
  "/players/me",
  authenticate,
  participantsController.getMyPlayer
);

// Criar perfil
router.post(
  "/players",
  authenticate,
  validateBody(createPlayerSchema),
  participantsController.createPlayer
);

// Atualizar próprio perfil
router.patch(
  "/players/me",
  authenticate,
  validateBody(updatePlayerSchema),
  participantsController.updateMyPlayer
);

// Listar jogadores
router.get(
  "/players",
  participantsController.listPlayers
);

// Consultar jogador por ID
router.get(
  "/players/:id",
  participantsController.getPlayerById
);

// ========================================
// DUPLAS
// ========================================

// Criar dupla
router.post(
  "/duos",
  authenticate,
  validateBody(createDuoSchema),
  participantsController.createDuo
);

// Listar duplas
router.get(
  "/duos",
  participantsController.listDuos
);

// Consultar dupla
router.get(
  "/duos/:id",
  participantsController.getDuoById
);

// Atualizar nome
router.patch(
  "/duos/:id",
  authenticate,
  validateBody(updateDuoSchema),
  participantsController.updateDuo
);

// Substituir os dois integrantes
router.put(
  "/duos/:id/members",
  authenticate,
  validateBody(replaceDuoMembersSchema),
  participantsController.replaceDuoMembers
);

export default router;
