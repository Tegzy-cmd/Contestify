import express from 'express';
import isAuthenticated from '../middlewares/userAuth.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getConfig, updateConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/config', isAuthenticated, isAdmin, getConfig);
router.put('/config', isAuthenticated, isAdmin, updateConfig);

export default router;
