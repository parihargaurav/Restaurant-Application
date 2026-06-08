// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";

// Local imports
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import authRouter from "./routes/authRoute.js";
import { dbConnection } from "./database/dbConnection.js";

const app = express();

/* =======================
   CORS Configuration
======================= */
// ✅ Allow CORS for Frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.replace(/\/$/, ""), 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

// ✅ Handle Preflight Requests Manually
app.options("*", cors()); // Handle OPTIONS requests globally

/* =======================
   Middlewares
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   API Routes
======================= */
// ✅ API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/payments", paymentRouter);

// ✅ Test Route (Check if API is working)
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "DineEase API",
  });
});

/* =======================
   Database Connection
======================= */
// ✅ Connect to Database
dbConnection();

/* =======================
   Error Middleware
======================= */
// ✅ Error Handling Middleware
app.use(errorMiddleware);


const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

export default app;