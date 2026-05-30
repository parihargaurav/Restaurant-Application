import Stripe from "stripe";
import payment from "../models/payment.js";
import  Reservation from "../models/reservation.js";
import { sendBookingEmail } from "../services/emailService.js";

let stripe;
const getStripe = () => {
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
};

/** CREATE PAYMENT INTENT — uses price from reservation, not client */
export const createPaymentIntent = async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    const amount = reservation.tablePrice; // 💰 server-side trusted price

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: amount * 100,           // INR → paise
      currency: "inr",
      metadata: { reservationId: reservationId.toString() },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/** CONFIRM PAYMENT, UPDATE RESERVATION, SEND EMAIL */
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, reservationId } = req.body;

    // 1. Re-verify with Stripe (don't trust the client)
    const intent = await getStripe().paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded")
      return res.status(400).json({ error: "Payment not completed" });

    // 2. Save payment
    await payment.create({
      reservationId,
      paymentIntentId,
      amount: intent.amount / 100,
      status: "succeeded",
    });

    // 3. Mark reservation paid
    const reservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { paymentStatus: "paid" },
      { new: true }
    );

    // 4. 📧 Fire-and-forget email (don't block response)
    sendBookingEmail(reservation, intent, req.user.email).catch((e) =>
      console.error("Email failed:", e.message)
    );

    res.status(200).json({ success: true, reservation });
  } catch (error) {
    console.error("Payment Save Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
