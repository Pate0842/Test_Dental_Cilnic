import { MedicalRecord } from "../models/medicalRecordSchema.js";
import { Appointment } from "../models/appointmentSchema.js";

// Tạo hồ sơ bệnh án
export const createMedicalRecord = async (req, res) => {
  try {
    // Truy vấn thông tin từ appointmentId trong request body
    const appointment = await Appointment.findById(req.body.appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch hẹn với ID đã cung cấp!",
      });
    }

    // Tạo hồ sơ bệnh án với đầy đủ thông tin của bác sĩ từ lịch hẹn
    const medicalRecord = new MedicalRecord({
      appointmentId: req.body.appointmentId,
      examinationDate: req.body.examinationDate,
      doctor: {
        firstName: appointment.doctor.firstName,
        lastName: appointment.doctor.lastName,
        department: appointment.department,
        doctorId: appointment.doctorId,
      },
      diagnosis: req.body.diagnosis,
      prescriptions: req.body.prescriptions,
    });

    // Lưu hồ sơ bệnh án vào cơ sở dữ liệu
    await medicalRecord.save();

    // Phản hồi thành công với thông báo rõ ràng
    res.status(201).json({
      success: true,
      message: "Hồ sơ bệnh án đã được tạo thành công!",
      medicalRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể tạo hồ sơ bệnh án.",
      error: error.message,
    });
  }
};


// Lấy hồ sơ bệnh án theo ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id).populate("patientId", "firstName lastName dob gender");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Hồ sơ không tồn tại!",
      });
    }

    const formattedRecord = {
      _id: record._id,
      patient: record.patient,
      examinationDate: record.examinationDate,
      doctor: record.doctor,
      diagnosis: record.diagnosis,
      prescriptions: record.prescriptions,
      appointmentId: record.appointmentId,
    };

    res.status(200).json({
      success: true,
      message: "Hồ sơ bệnh án được tìm thấy!",
      record: formattedRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể tìm thấy hồ sơ bệnh án.",
      error: error.message,
    });
  }
};

// Cập nhật hồ sơ bệnh án
export const updateMedicalRecord = async (req, res) => {
  try {
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: "Hồ sơ không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hồ sơ bệnh án đã được cập nhật thành công!",
      updatedRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể cập nhật hồ sơ bệnh án.",
      error: error.message,
    });
  }
};

// Xóa hồ sơ bệnh án
export const deleteMedicalRecord = async (req, res) => {
  try {
    const deletedRecord = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "Hồ sơ không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa hồ sơ bệnh án thành công!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể xóa hồ sơ bệnh án.",
      error: error.message,
    });
  }
};