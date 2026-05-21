import cors from "cors";
import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5001;

//Get the file path from URL of current module
const __filename = fileURLToPath(import.meta.url);
//Get the directory name from the file path of current module
const __dirname = dirname(__filename);

const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

//Middlesware
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
const clientDistPath = path.join(__dirname, "../client/dist");
const publicPath = path.join(__dirname, "../public");

// Serve static assets (React build first, legacy public as fallback)
app.use(express.static(clientDistPath));
app.use(express.static(publicPath));

//  Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);
app.use("/contact", contactRoutes);
app.use("/dashboard", authMiddleware, dashboardRoutes);

app.get(/.*/, (req, res) => {
  const reactIndex = path.join(clientDistPath, "index.html");
  if (fs.existsSync(reactIndex)) {
    return res.sendFile(reactIndex);
  }
  return res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
