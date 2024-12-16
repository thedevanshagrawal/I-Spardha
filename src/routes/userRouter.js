import { Router } from "express";
import { deleteUser, loginUser, logoutUser, modifyUser, registerUser, userDetails } from "../controller/user.contoller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/userDetails").get(userDetails)
router.route("/modifyUser").post(modifyUser)
router.route("/deleteUser").post(deleteUser)
router.route("/login").post(loginUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)

export default router