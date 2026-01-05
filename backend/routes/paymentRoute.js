import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
} from "../controller/payment.js";

const router = express.Router();

// Create payment intent
router.post("/create-payment-intent", createPaymentIntent);

// Confirm & store payment
router.post("/confirm", confirmPayment);

export default router;
