import { Router } from "express";
import { createPlayer, deletePlayer, getAllPlayers, updatePlayer } from "../controller/player.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/createPlayer").post(verifyJWT, createPlayer)
router.route("/getAllPlayers").get(verifyJWT, getAllPlayers)
router.route("/deletePlayer/:playerId").delete(verifyJWT, deletePlayer);
router.route("/updatePlayer").post(verifyJWT, updatePlayer);

export default router;