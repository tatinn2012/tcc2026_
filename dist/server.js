import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import { env, corsOrigins } from "./config/env.js";
import { checkDatabaseConnection, closeDatabase, } from "./db/index.js";
import { registerGameGateway } from "./realtime/game.gateway.js";
// Servidor HTTP
const httpServer = createServer(app);
// Servidor Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: corsOrigins,
        credentials: true,
        methods: ["GET", "POST"],
    },
});
// Registra os eventos de tempo real
registerGameGateway(io);
// Inicialização
async function startServer() {
    console.log("[SERVER] Iniciando aplicação...");
    // Testa o banco antes de iniciar
    await checkDatabaseConnection();
    console.log("[DATABASE] Neon conectado!");
    // Inicia o HTTP Server
    await new Promise((resolve, reject) => {
        const onError = (error) => reject(error);
        httpServer.once("error", onError);
        httpServer.listen(env.PORT, env.HOST, () => {
            httpServer.off("error", onError);
            resolve();
        });
    });
    console.log("--------------------------------");
    console.log(" TRUCO CHAMPIONSHIP API");
    console.log("--------------------------------");
    console.log(`Ambiente: ${env.NODE_ENV}`);
    console.log(`Porta: ${env.PORT}`);
    console.log(`API: http://localhost:${env.PORT}/api/v1`);
    console.log(`Health: http://localhost:${env.PORT}/health`);
    console.log("--------------------------------");
}
// Encerramento seguro
let isShuttingDown = false;
async function shutdown(signal) {
    if (isShuttingDown)
        return;
    isShuttingDown = true;
    console.log(`[SERVER] Encerrando: ${signal}`);
    await new Promise((resolve) => {
        io.close(() => resolve());
    });
    await closeDatabase();
    console.log("[SERVER] Aplicação encerrada.");
}
process.once("SIGINT", () => {
    void shutdown("SIGINT").catch((error) => {
        console.error("[SERVER] Erro ao encerrar:", error);
        process.exitCode = 1;
    });
});
process.once("SIGTERM", () => {
    void shutdown("SIGTERM").catch((error) => {
        console.error("[SERVER] Erro ao encerrar:", error);
        process.exitCode = 1;
    });
});
// Executa o servidor
startServer().catch(async (error) => {
    console.error("[SERVER] Falha ao iniciar:", error);
    try {
        await closeDatabase();
    }
    catch (closeError) {
        console.error("[DATABASE] Erro ao fechar conexão:", closeError);
    }
    process.exitCode = 1;
});
//# sourceMappingURL=server.js.map