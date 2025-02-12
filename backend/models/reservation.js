// businees logic of the code like here we want to send the data to the database.
import mongoose from "mongoose";
import validator from "validator"; // we use validator to validate the email address

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [4, "First name must be of at least 3 Characters."],
    maxLength: [10, "First name cannot exceed 30 Characters."],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [4, "Last name must be of at least 3 Characters."],
    maxLength: [10, "Last name cannot exceed 30 Characters."],
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide a valid email"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone number must contain 10 Digits."],
    maxLength: [10, "Phone number must contain 10 Digits."],
  },
});

export const Reservation = mongoose.model("Reservation", reservationSchema);