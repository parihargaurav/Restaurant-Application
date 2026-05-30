import jwt from "jsonwebtoken";
import  User  from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
      return res.status(401).json({ success: false, message: "Login required" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user; // attach to request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid / expired token" });
  }
};
