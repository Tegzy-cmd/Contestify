import { Router } from "express";
import { userAuth } from '../middlewares/userAuth.js';
import {isAdminAuth} from '../middlewares/isAdminAuth.js';
import { upload } from '../middlewares/upload.js'; // Assuming you have a middleware for file uploads
const router = Router();
import {
  createProfile,
  approveProfile,
  listApprovedProfiles,
  deleteProfile,
} from '../controllers/contestantController.js';

// Public
router.get("/", listApprovedProfiles);

// Contestant
router.post("/", userAuth,upload.single('photo'), createProfile);

// Admin only
router.put("/", userAuth, isAdminAuth, createProfile); // Admin can also create profiles
// Admin can approve profiles
router.put("/:id/approve", userAuth, isAdminAuth, approveProfile);
// Admin can list all profiles
router.get("/admin", userAuth, isAdminAuth, listApprovedProfiles);
// Admin/user can delete their profile can specific delete profile
router.delete('/:id',userAuth,deleteProfile)

export default router;
