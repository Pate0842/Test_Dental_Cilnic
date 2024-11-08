import express from "express"
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister, deleteDoctors, updateDoctorHandler, getAllPatients, deletePatient, updatePatientProfile, verifyEmail} from "../controller/userController.js";
import {isAdminAuthenticated, isPatientAuthenticated} from "../middlewares/auth.js"

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/patients", getAllPatients);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.delete("/doctors/delete/:id", isAdminAuthenticated, deleteDoctors);
router.delete("/patients/delete/:id", isAdminAuthenticated, deletePatient);
router.put("/doctors/update/:id", updateDoctorHandler);
router.put("/patient/update", isPatientAuthenticated, updatePatientProfile);
router.get('/verify/:token', verifyEmail);

export default router;  