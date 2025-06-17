import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/upload.js"; // Assuming you have a middleware for file uploads
import {
  createProfile,
  deleteProfile,
  getProfile,
} from "../controllers/contestantController.js";

const contestantRouter = Router();
// contestantRouter is the router for handling contestant-related routes.

// This file defines the routes for managing contestant profiles in the application.

// Contestant
contestantRouter.post(
  "/create-profile",
  isAuthenticated,
  upload.single("photo"),
  createProfile
);
contestantRouter.post("/:id/delete", isAuthenticated, deleteProfile); // Delete profile
contestantRouter.get("/get-profile", isAuthenticated, getProfile); // Get profile by ID

export default contestantRouter;
