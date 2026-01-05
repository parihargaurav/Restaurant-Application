import Stripe from "stripe";
import payment from "../models/payment.js";

// Lazy initialize Stripe client (ensure env var is loaded first)
let stripe;
const getStripe = () => {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

/**
 * CREATE PAYMENT INTENT
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, reservationId } = req.body;

    // Create payment intent in Stripe
    const stripeClient = getStripe();
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount * 100, // INR → paise
      currency: "inr",
      metadata: { reservationId },
    });

    // Send client secret to frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * CONFIRM PAYMENT & SAVE TO DB
 */
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, reservationId, amount } = req.body;

    // Save payment details in DB
    await payment.create({
      reservationId,
      paymentIntentId,
      amount,
      status: "succeeded",
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Payment Save Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
