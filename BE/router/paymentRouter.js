import express from "express";
import { createPayment, handleIPN } from "../controller/paymentController.js";

const router = express.Router();

// Endpoint tạo thanh toán
router.post("/create-payment", createPayment);

// Endpoint xử lý IPN từ MoMo
router.post("/ipn", handleIPN);

export default router;