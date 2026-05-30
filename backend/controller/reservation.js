import ErrorHandler from "../middlewares/error.js";
import Reservation from "../models/reservation.js";

// Simple price table (could come from DB)
const TABLE_PRICES = {
  "2-seater": 200,
  "4-seater": 400,
  "6-seater": 600,
  "VIP":      1500,
};

const send_reservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone, tableType = "2-seater" } = req.body;

  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please fill the full reservation form!", 400));
  }

  try {
    const tablePrice = TABLE_PRICES[tableType] ?? TABLE_PRICES["2-seater"];

    const reservation = await Reservation.create({
      userId: req.user._id,        // 🔒 from auth middleware
      firstName, lastName, email, date, time, phone,
      tableType, tablePrice,
    });

    res.status(201).json({
      success: true,
      message: "Reservation created. Please proceed to payment.",
      reservationId: reservation._id,
      tablePrice,
      tableType,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const msgs = Object.values(error.errors).map(e => e.message);
      return next(new ErrorHandler(msgs.join(", "), 400));
    }
    return next(error);
  }
};

export default send_reservation;
