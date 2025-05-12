import { Router } from "express";
import generatorController from "../controllers/generator.js";
import enumController from "../controllers/enum.js";

const router = Router();

router.post("/generator", generatorController.toCreate);
router.post("/enum/getList", enumController.getList);
router.post("/enum/delete", enumController.delete);
router.post("/enum/create", enumController.create);
router.post("/enum/update", enumController.update);
router.get("/enum/getDetail", enumController.getDetail);
router.get("/enum/getEnumList", enumController.getEnumList);
router.get("/enum/getEnumDetail", enumController.getEnumDetail);
router.post("/enum/createEnum", enumController.createEnum);
router.post("/enum/updateEnum", enumController.updateEnum);
router.post("/enum/deleteEnum", enumController.deleteEnum);

export default router;
