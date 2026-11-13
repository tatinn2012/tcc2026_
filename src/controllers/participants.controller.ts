
import type {
    Request,
    Response,
    RequestHandler,
  } from "express";
  
  import { idParamSchema, listParticipantsQuerySchema } from "../validators/participants.validation.js";
  
  import * as participantsService from "../services/participants.service.js";
  
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
  
  function requireUserId(req: Request, res: Response): string | null {
    const userId = req.authUser?.id;
  
    if (!userId) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Autenticação necessária.",
      });
  
      return null;
    }
  
    return userId;
  }
  
  function sendValidationError(
    res: Response,
    issues: Array<{
      path: PropertyKey[];
      message: string;
    }>
  ): void {
    res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Os dados enviados são inválidos.",
      details: issues.map((issue) => ({
        campo: issue.path.map(String).join("."),
        mensagem: issue.message,
      })),
    });
  }
  
  
function getValidId(
    value: unknown,
    res: Response
  ): string | null {
    const result = idParamSchema.safeParse({
      id: value,
    });
  
    if (!result.success) {
      sendValidationError(res, result.error.issues);
      return null;
    }
  
    return result.data.id;
  }
  
  
  // ========================================
  // JOGADORES
  // ========================================
  
  export const createPlayer: RequestHandler = async (req, res) => {
    const userId = requireUserId(req, res);
  
    if (!userId) return;
  
    const player = await participantsService.createPlayer(
      userId,
      req.body as CreatePlayerInput
    );
  
    res.status(201).json({
      message: "Perfil de jogador criado com sucesso.",
      player,
    });
  };
  
  export const getMyPlayer: RequestHandler = async (req, res) => {
    const userId = requireUserId(req, res);
  
    if (!userId) return;
  
    const player = await participantsService.getMyPlayer(userId);
  
    res.status(200).json({ player });
  };
  
  export const getPlayerById: RequestHandler = async (req, res) => {
    const id = getValidId(req.params.id, res);
  
    if (!id) return;
  
    const player = await participantsService.getPlayerById(id);
  
    res.status(200).json({ player });
  };
  
  export const updateMyPlayer: RequestHandler = async (req, res) => {
    const userId = requireUserId(req, res);
  
    if (!userId) return;
  
    const player = await participantsService.updateMyPlayer(
      userId,
      req.body as UpdatePlayerInput
    );
  
    res.status(200).json({
      message: "Perfil atualizado com sucesso.",
      player,
    });
  };
  
  export const listPlayers: RequestHandler = async (req, res) => {
    const query = listParticipantsQuerySchema.safeParse(req.query);
  
    if (!query.success) {
      sendValidationError(res, query.error.issues);
      return;
    }
  
    const result = await participantsService.listPlayers(query.data);
  
    res.status(200).json(result);
  };
  
  // ========================================
  // DUPLAS
  // ========================================
  
  export const createDuo: RequestHandler = async (req, res) => {
    const userId = requireUserId(req, res);
  
    if (!userId) return;
  
    const duo = await participantsService.createDuo(
      userId,
      req.body as CreateDuoInput
    );
  
    res.status(201).json({
      message: "Dupla criada com sucesso.",
      duo,
    });
  };
  
  export const getDuoById: RequestHandler = async (req, res) => {
    const id = getValidId(req.params.id, res);
  
    if (!id) return;
  
    const duo = await participantsService.getDuoById(id);
  
    res.status(200).json({ duo });
  };
  
  export const listDuos: RequestHandler = async (req, res) => {
    const query = listParticipantsQuerySchema.safeParse(req.query);
  
    if (!query.success) {
      sendValidationError(res, query.error.issues);
      return;
    }
  
    const result = await participantsService.listDuos(query.data);
  
    res.status(200).json(result);
  };
  
  export const updateDuo: RequestHandler = async (req, res) => {
    const userId = requireUserId(req, res);
  
    if (!userId) return;
  
    const id = getValidId(req.params.id, res);
  
    if (!id) return;
  
    const duo = await participantsService.updateDuo(
      id,
      userId,
      req.body as UpdateDuoInput
    );
  
    res.status(200).json({
      message: "Dupla atualizada com sucesso.",
      duo,
    });
  };
  
  export const replaceDuoMembers: RequestHandler = async (req, res) => {
    const userId = requireUserId(req, res);
  
    if (!userId) return;
  
    const id = getValidId(req.params.id, res);
  
    if (!id) return;
  
    const duo = await participantsService.replaceDuoMembers(
      id,
      userId,
      req.body as ReplaceDuoMembersInput
    );
  
    res.status(200).json({
      message: "Integrantes atualizados com sucesso.",
      duo,
    });
  };
  