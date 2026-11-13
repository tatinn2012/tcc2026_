import { Router } from "express";

import usersRoutes from "./users.routes.js";
import participantsRoutes from "./participants.routes.js";
import tournamentsRoutes from "./tournaments.routes.js";
import bracketsRoutes from "./brackets.routes.js";
import gamesRoutes from "./games.routes.js";
import auditRoutes from "./audit.routes.js";

const router = Router();

router.use("/users", usersRoutes);
router.use(participantsRoutes);
router.use("/tournaments", tournamentsRoutes);
router.use("/brackets", bracketsRoutes);
router.use("/games", gamesRoutes);
router.use("/audit", auditRoutes);

router.get("/", (_req, res) => {
  res.json({
    name: "Truco Championship API",
    version: "1.0.0",
    status: "online",
  });
});

export default router;