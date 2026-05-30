import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,           // 🔒 must be logged in
    },
    firstName: { type: String, required: true, minLength: 3, maxLength: 30 },
    lastName:  { type: String, required: true, minLength: 3, maxLength: 30 },
    date:      { type: String, required: true },
    time:      { type: String, required: true },
    email:     { type: String, required: true, validate: [validator.isEmail, "Invalid email"] },
    phone:     { type: String, required: true, minLength: 10, maxLength: 10 },

    // 💰 NEW: pricing fields
    tableType: { type: String, enum: ["2-seater", "4-seater", "6-seater", "VIP"], default: "2-seater" },
    tablePrice:{ type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;