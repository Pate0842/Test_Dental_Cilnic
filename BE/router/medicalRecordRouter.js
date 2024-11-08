import express from "express";
import { 
  createMedicalRecord, 
  getMedicalRecordById, 
  updateMedicalRecord, 
  deleteMedicalRecord 
} from "../controller/medicalRecordController.js";

const router = express.Router();

router.post("/post", createMedicalRecord); // Tạo hồ sơ bệnh án mới
router.get("/get/:id", getMedicalRecordById); // Lấy thông tin hồ sơ theo ID
router.put("/put/:id", updateMedicalRecord); // Cập nhật hồ sơ
router.delete("/delete/:id", deleteMedicalRecord); // Xóa hồ sơ

export default router;