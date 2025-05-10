import { Router } from "express";
import testController from "../controllers/test.js";

const router = Router();

router.post("/test/getList", testController.getList);

export default router;
