import { Router } from "express";
import { userAuth } from "../middlewares/userAuth.js";
import upload from "../middlewares/upload.js"; // Assuming you have a middleware for file uploads
import {
  createProfile,
  approveProfile,
  listApprovedProfiles,
  deleteProfile,
} from "../controllers/contestantController.js";
import { isAuthenticated } from "../controllers/authController.js";


const contestantRouter = Router();
// contestantRouter is the router for handling contestant-related routes.

// This file defines the routes for managing contestant profiles in the application.

// Contestant
contestantRouter.post("/create-profile", userAuth, upload.single("photo"), createProfile);



export default contestantRouter;
