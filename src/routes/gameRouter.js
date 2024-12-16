import { Router } from "express";
import { createGame, getAllGame } from "../controller/game.contoller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/createGame").post(verifyJWT,createGame)
router.route("/getAllGame").get(verifyJWT,getAllGame)

export default router