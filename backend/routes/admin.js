import express from "express";
import isAuthenticated from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import { getConfig, updateConfig } from "../controllers/configController.js";

const router = express.Router();

//Admin route
authRouter.post("/login", isAdmin, login); // import { login } from '../controllers/authController.js';
authRouter.post("/logout", logout); // import { logout } from '../controllers/authController.js';

//Set Website Config
router.get("/config", isAuthenticated, isAdmin, getConfig);
router.put("/config", isAuthenticated, isAdmin, updateConfig);

export default router;
