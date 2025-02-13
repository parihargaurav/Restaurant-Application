import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import { dbConnection } from "./database/dbConnection.js";

dotenv.config();  // Load environment variables

const app = express();

// ✅ Allow CORS for Frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173",  // Remove trailing slash
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // ✅ Ensure OPTIONS is allowed
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],  // ✅ Allow necessary headers
  })
);

// ✅ Handle Preflight Requests Manually
app.options("*", cors());  // Handle OPTIONS requests globally

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/v1/reservation", reservationRouter);

// ✅ Test Route (Check if API is working)
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "HELLO WORLD AGAIN",
  });
});

// ✅ Connect to Database
dbConnection();

// ✅ Error Handling Middleware
app.use(errorMiddleware);

export default app;
