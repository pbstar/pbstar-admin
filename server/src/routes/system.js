import { Router } from "express";
import generatorController from "../controllers/generator.js";
import enumController from "../controllers/enum.js";
import navController from "../controllers/nav.js";
import userController from "../controllers/user.js";
import roleController from "../controllers/role.js";

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

router.post("/nav/getList", navController.getList);
router.post("/nav/delete", navController.delete);
router.post("/nav/create", navController.create);
router.post("/nav/update", navController.update);
router.get("/nav/getDetail", navController.getDetail);

router.post("/user/getList", userController.getList);
router.post("/user/delete", userController.delete);
router.post("/user/create", userController.create);
router.post("/user/update", userController.update);
router.get("/user/getDetail", userController.getDetail);

router.post("/role/getList", roleController.getList);
router.post("/role/delete", roleController.delete);
router.post("/role/create", roleController.create);
router.post("/role/update", roleController.update);
router.get("/role/getDetail", roleController.getDetail);

export default router;
