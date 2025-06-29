import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  login,
  logout,
  isAuthenticated,
} from "../controllers/authController.js";
import { isAdminAuth } from "../middlewares/isAdminAuth.js";
import {
  approveProfile,
  listApprovedProfiles,
  deleteProfile,
} from "../controllers/contestantController.js";

import { getConfig, updateConfig } from "../controllers/configController.js";

const adminRouter = express.Router();

//Admin auth route
adminRouter.post("/login", isAdminAuth, login); // import { login } from '../controllers/authController.js';
adminRouter.post("/logout", logout); // import { logout } from '../controllers/authController.js';

// Admin can list all profiles
adminRouter.get(
  "/approved-profiles",
  isAdminAuth,
  isAuthenticated,
  listApprovedProfiles
);

// Admin can approve profiles
adminRouter.put("/:id/approve", isAdminAuth, isAuthenticated, approveProfile);

// Admin/user can delete their profile can specific delete profile
adminRouter.delete("/:id", isAdminAuth, deleteProfile);

//Set Website Config
adminRouter.get("/config", isAdminAuth, getConfig);
adminRouter.put("/config", isAdminAuth, updateConfig);

export default adminRouter;
