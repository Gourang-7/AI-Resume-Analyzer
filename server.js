import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Health Route to verify the server is running
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "AI Resume Analyzer API is operational.",
  });
});

// Route Mounts
app.use("/api/resume", uploadRoutes);

// Start Server
async function startServer() {
  try {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== "your_mongodb_connection_string_here") {
      await connectDB();
    } else {
      console.warn("MONGODB_URI is not set to a valid string. Skipping DB connection for now.");
    }

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();