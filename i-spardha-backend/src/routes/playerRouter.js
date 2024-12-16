import { Router } from "express";
import { createPlayer, getAllPlayers } from "../controller/player.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/createPlayer").post(verifyJWT, createPlayer)
router.route("/getAllPlayers").get(verifyJWT, getAllPlayers)

export default router;