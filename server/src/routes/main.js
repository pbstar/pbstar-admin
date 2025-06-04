import { Router } from "express";
import navController from "../controllers/nav.js";
import enumController from "../controllers/enum.js";
import userController from "../controllers/user.js";

const router = Router();

router.get("/getMyNavTreeList", navController.getMyNavTreeList);
router.get("/getNavList", navController.getNavList);
router.get("/getEnum", enumController.getEnum);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/loginByToken", userController.loginByToken);
router.post("/updateMyInfo", userController.updateMyInfo);

export default router;
