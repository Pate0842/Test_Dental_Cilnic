import express from "express";
import { getAllMessages, sendMessage, findMessageByEmail } from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);
router.get("/findByEmail", findMessageByEmail); // Thêm API mới để sử dụng prototype pattern

export default router;
