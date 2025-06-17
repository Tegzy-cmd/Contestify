import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAdminAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token, please login again" });
    }
    // check if user isAdmin
    const user = User.findById(decoded.id);
    if (!user.role === "admin") {
      return res
        .status(401)
        .json({ success: false, message: "You are not an admin" });
    }
    // Attach user ID to request object for further use
    req.body.userId = decoded.id;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid token, please login again" });
  }
};

// server/middleware/isAuthenticated.js
// This middleware checks if the user is authenticated by verifying the JWT token
// If the token is valid, it attaches the user ID to the request object and calls next()
// If the token is invalid or missing, it responds with an error message
// This middleware is used to protect routes that require authentication
// It is typically used in routes that require user authentication, such as protected routes
// It ensures that only authenticated users can access certain routes
