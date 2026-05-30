import express from "express";
import { googleLogin } from "../controller/auth.js";

const router = express.Router();
router.post("/google", googleLogin);
export default router;
