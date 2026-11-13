import { AppError } from "../shared/app-error.js";
import * as usersService from "../services/users.service.js";
export const register = async (req, res) => {
    const result = await usersService.register(req.body);
    res.status(201).json({
        message: "Usuário cadastrado com sucesso.",
        ...result,
    });
};
export const login = async (req, res) => {
    const result = await usersService.login(req.body);
    res.status(200).json({
        message: "Login realizado com sucesso.",
        ...result,
    });
};
export const getMe = async (req, res) => {
    const userId = req.authUser?.id;
    if (!userId) {
        throw new AppError(401, "Autenticação necessária.", "UNAUTHORIZED");
    }
    const user = await usersService.getProfile(userId);
    res.status(200).json({ user });
};
export const updateMe = async (req, res) => {
    const userId = req.authUser?.id;
    if (!userId) {
        throw new AppError(401, "Autenticação necessária.", "UNAUTHORIZED");
    }
    const user = await usersService.updateProfile(userId, req.body);
    res.status(200).json({
        message: "Perfil atualizado com sucesso.",
        user,
    });
};
//# sourceMappingURL=users.controller.js.map