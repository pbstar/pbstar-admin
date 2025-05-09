import { Router } from "express";
import generatorController from "../controllers/generator.js";

const router = Router();

router.post("/generator", generatorController.toCreate);

export default router;
