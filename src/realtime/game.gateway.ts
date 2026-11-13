
import type { Server } from "socket.io";

export function registerGameGateway(io: Server): void {
  io.on("connection", (socket) => {
    console.log(`[SOCKET] Cliente conectado: ${socket.id}`);

    socket.emit("server:ready", {
      message: "Conectado ao servidor do Truco Championship",
      timestamp: new Date().toISOString(),
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `[SOCKET] Cliente desconectado: ${socket.id} - ${reason}`,
      );
    });
  });
}
