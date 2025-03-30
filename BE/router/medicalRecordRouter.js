import express from "express";
import {
  createMedicalRecord,
  getAllMedicalRecords,
  getDetailMedicalRecordById,
  deleteMedicalRecord,
  updateMedicalRecord,
  getMedicalRecordsByPatientId
} from "../controller/medicalRecordController.js";

const router = express.Router();

router.post("/post", createMedicalRecord);

router.get("/getAll", getAllMedicalRecords);

router.get("/getDetail/:id", getDetailMedicalRecordById);

router.get("/get/:patientId", getMedicalRecordsByPatientId);

router.put("/put/:id", updateMedicalRecord);

router.delete("/delete/:id", deleteMedicalRecord);


export default router;