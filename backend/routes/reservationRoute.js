import express from "express";
import send_reservation from "../controller/reservation.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", isAuthenticated, send_reservation);   // 🔒 protected

export default router;
