import { Router } from "express";
import {
    addPoints,
    deleteHouseAndGame,
    getGames,
    getPointTable,
    resetPoints,
    addGame,
} from "../controller/PointTable.controller.js";

const router = Router();

router.route("/addPoints").post(addPoints);
router.route("/getPointTable").get(getPointTable);
router.route("/getGames").get(getGames);
router.route("/resetPoints").post(resetPoints);
router.route("/deleteHouseAndGame").delete(deleteHouseAndGame);
router.route("/addGame").post(addGame);

export default router;
