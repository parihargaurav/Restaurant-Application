// we use controller to send the data to the database.


import ErrorHandler from "../middlewares/error.js";
import { Reservation } from "../models/reservation.js";


const send_reservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone } = req.body;
  if (!firstName || !lastName || !email || !date || !time || !phone) {
    return next(new ErrorHandler("Please Fill Full Reservation Form!", 400));
  }

  try {
    await Reservation.create({ firstName, lastName, email, date, time, phone });
    res.status(201).json({
      success: true,
      message: "Reservation Sent Successfully!",
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }

    // Handle other errors
    return next(error);
  }
};


export default send_reservation;

/*In the `send_reservation` function, the `next` parameter is used along with `req` and `res` because it is an Express middleware function.
 The `next` function is used to pass control to the next middleware function in the stack. Here's why `next` is used alongside `req` and `res`:

- **Error Handling**: If there is an error (e.g., missing fields in the reservation form, Mongoose validation errors),
 the `next` function is called with an `ErrorHandler` instance to pass the error to the next error-handling middleware.
- **Middleware Flow**: Using `next` allows the function to continue the middleware chain, ensuring that other middleware functions or the final request handler can process the request.

By using `next`, the function can handle errors properly and maintain the flow of middleware execution in the Express application. */