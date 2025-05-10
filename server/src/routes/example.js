import { Router } from "express";
import testController from "../controllers/test.js";

const router = Router();

router.post("/test/getList", testController.getList);
router.post("/test/delete", testController.delete);
router.post("/test/create", testController.create);
router.post("/test/update", testController.update);
router.get("/test/getDetail", testController.getDetail);

export default router;
