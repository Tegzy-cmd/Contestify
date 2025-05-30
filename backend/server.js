import dotenv from "dotenv";
import express from "express";
import {connectDB} from "./config/mongoDb.js";

dotenv.config();
const app = express();
import authRoutes from "./routes/auth.js";
import voteRoutes from "./routes/vote.js";
import webhookRoutes from "./routes/webhook.js";
import contestantRoutes from "./routes/contestant.js";

app.use(express.json());

// Connect to MongoDB
connectDB();

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/payment", webhookRoutes);
app.use("/api/contestants", contestantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
