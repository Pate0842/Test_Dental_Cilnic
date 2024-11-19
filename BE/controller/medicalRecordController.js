import { MedicalRecord } from "../models/medicalRecordSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import { Service } from "../models/serviceSchema.js";

export const createMedicalRecord = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.body.appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch hẹn với ID đã cung cấp!",
      });
    }

    const services = req.body.services || [];
    for (const service of services) {
      const exists = await Service.findById(service.serviceId);
      if (!exists || !exists.isActive) {
        return res.status(400).json({
          success: false,
          message: `Dịch vụ với ID ${service.serviceId} không hợp lệ hoặc không hoạt động!`,
        });
      }
    }

    // Tạo hồ sơ bệnh án với đầy đủ thông tin
    const medicalRecord = new MedicalRecord({
      appointmentId: req.body.appointmentId,
      patientId: appointment.patientId,
      examinationDate: req.body.examinationDate,
      doctor: {
        firstName: appointment.doctor.firstName,
        lastName: appointment.doctor.lastName,
        department: appointment.department,
        doctorId: appointment.doctorId,
      },
      diagnosis: req.body.diagnosis,
      prescriptions: req.body.prescriptions,
      services,
    });

    // Lưu hồ sơ bệnh án và đánh dấu lịch hẹn đã xử lý
    await medicalRecord.save();
    appointment.isProcessed = true;
    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Hồ sơ bệnh án đã được tạo thành công!",
      medicalRecord: medicalRecord.toObject(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể tạo hồ sơ bệnh án.",
      error: error.message,
    });
  }
};

export const getAllMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find().populate([
      { path: "patientId", select: "name email" },
      { path: "appointmentId", select: "date isProcessed" },
      { path: "doctor.doctorId", select: "name department" },
      { path: "services.serviceId", select: "name price" },
    ]);

    res.status(200).json({
      success: true,
      medicalRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách hồ sơ bệnh án.",
      error: error.message,
    });
  }
};

export const getDetailMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicalRecord = await MedicalRecord.findById(id).populate([
      { path: "patientId", select: "name email" },
      { path: "appointmentId", select: "date isProcessed" },
      { path: "doctor.doctorId", select: "name department" },
      { path: "services.serviceId", select: "name price" },
    ]);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ bệnh án với ID đã cung cấp!",
      });
    }

    res.status(200).json({
      success: true,
      medicalRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy chi tiết hồ sơ bệnh án.",
      error: error.message,
    });
  }
};

export const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecord = await MedicalRecord.findByIdAndDelete(id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ bệnh án với ID đã cung cấp!",
      });
    }

    // Optionally reset appointment status if needed
    const appointment = await Appointment.findById(medicalRecord.appointmentId);
    if (appointment) {
      appointment.isProcessed = false;
      await appointment.save();
    }

    res.status(200).json({
      success: true,
      message: "Hồ sơ bệnh án đã được xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa hồ sơ bệnh án.",
      error: error.message,
    });
  }
};

export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = req.body;

    // Validate services
    if (updatedData.services) {
      for (const service of updatedData.services) {
        const exists = await Service.findById(service.serviceId);
        if (!exists || !exists.isActive) {
          return res.status(400).json({
            success: false,
            message: `Dịch vụ với ID ${service.serviceId} không hợp lệ hoặc không hoạt động!`,
          });
        }
      }
    }

    const medicalRecord = await MedicalRecord.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "patientId", select: "name email" },
      { path: "appointmentId", select: "date isProcessed" },
      { path: "doctor.doctorId", select: "name department" },
      { path: "services.serviceId", select: "name price" },
    ]);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hồ sơ bệnh án với ID đã cung cấp!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hồ sơ bệnh án đã được cập nhật thành công!",
      medicalRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật hồ sơ bệnh án.",
      error: error.message,
    });
  }
};