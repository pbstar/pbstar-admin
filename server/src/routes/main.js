import { Router } from "express";
import navController from "../controllers/nav.js";
import enumController from "../controllers/enum.js";

const router = Router();

router.get("/getNavTreeList", navController.getNavTreeList);
router.get("/getNavList", navController.getNavList);
router.get("/getEnum", enumController.getEnum);

export default router;
