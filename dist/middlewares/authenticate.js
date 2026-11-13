import { verifyAccessToken } from "../shared/jwt.js";
import { AppError } from "../shared/app-error.js";
export const authenticate = async (req, _res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
        next(new AppError(401, "Autenticação necessária.", "UNAUTHORIZED"));
        return;
    }
    const token = authorization.slice(7);
    try {
        const userId = await verifyAccessToken(token);
        req.authUser = { id: userId };
        next();
    }
    catch {
        next(new AppError(401, "Token inválido ou expirado.", "INVALID_TOKEN"));
    }
};
//# sourceMappingURL=authenticate.js.map