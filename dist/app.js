import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env, corsOrigins } from "./config/env.js";
import { checkDatabaseConnection } from "./db/index.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";
const app = express();
// Segurança básica
app.disable("x-powered-by");
app.use(helmet());
// CORS
app.use(cors({
    origin: corsOrigins,
    credentials: true,
}));
// Leitura de JSON
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
// Verificação básica do servidor
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        service: "truco-championship-api",
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});
// Verificação do banco de dados
app.get("/health/ready", async (_req, res) => {
    try {
        await checkDatabaseConnection();
        res.status(200).json({
            status: "ready",
            database: "connected",
        });
    }
    catch {
        res.status(503).json({
            status: "unavailable",
            database: "disconnected",
        });
    }
});
// Rotas da API
app.use("/api/v1", apiRoutes);
// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        error: "ROUTE_NOT_FOUND",
        message: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
    });
});
// Tratamento global de erros
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map