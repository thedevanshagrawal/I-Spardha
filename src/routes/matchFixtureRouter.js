import { Router } from "express";
import { addPlayersToFixture, createMatchFixture, matchFixtureDetails } from "../controller/matchFixture.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/createMatchFixture").post(verifyJWT, createMatchFixture)
router.route("/addPlayersToFixture").post(verifyJWT, addPlayersToFixture)
router.route("/matchFixtureDetails").get(verifyJWT, matchFixtureDetails)

export default router