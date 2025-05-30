import { Router } from "express";
import { userAuth } from '../middlewares/userAuth.js';
import {isAdminAuth} from '../middlewares/isAdminAuth.js';
const router = Router();
import {
  createProfile,
  approveProfile,
  listApprovedProfiles,
} from '../controllers/contestantController.js';

// Public
router.get("/", listApprovedProfiles);

// Contestant
router.post("/", userAuth, createProfile);

// Admin only
router.put("/", userAuth, isAdminAuth, createProfile); // Admin can also create profiles
// Admin can approve profiles
router.put("/:id/approve", userAuth, isAdminAuth, approveProfile);
// Admin can list all profiles
router.get("/admin", userAuth, isAdminAuth, listApprovedProfiles);
// Admin can specific delete profile
router.put

export default router;
