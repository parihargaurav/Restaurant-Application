import express from "express";
import { createPaymentIntent, confirmPayment } from "../controller/payment.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-payment-intent", isAuthenticated, createPaymentIntent);
router.post("/confirm",               isAuthenticated, confirmPayment);

export default router;