// server.js
import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Local imports
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import { dbConnection } from "./database/dbConnection.js";

// Load environment variables
dotenv.config();

const app = express();

/* =======================
   CORS Configuration
======================= */
app.use(
  cors({
    origin:
      process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

/* =======================
   Middlewares
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   Routes
======================= */
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/payments", paymentRouter);


// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HELLO WORLD AGAIN",
  });
});


/* =======================
   Database Connection
======================= */
dbConnection();

/* =======================
   Error Middleware
======================= */
app.use(errorMiddleware);

/* =======================
   Server Start
======================= */
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
