import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";

const send_reservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone } = req.body;

  // 1️⃣ Validation
  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    // 2️⃣ Create reservation & STORE result
    const reservation = await Reservation.create({
      firstName,
      lastName,
      email,
      date,
      time,
      phone,
    });

    // 3️⃣ Send reservationId to frontend
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
      reservationId: reservation._id, // 🔥 IMPORTANT
    });
    
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(
        new ErrorHandler(validationErrors.join(", "), 400)
      );
    }
    return next(error);
  }
};

export default send_reservation;
