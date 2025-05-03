import { Router } from 'express';
import navController from '../controllers/nav.js';

const router = Router();

router.get('/getNavTreeList', navController.getNavTreeList);
router.get('/getNavList', navController.getNavList);

export default router;