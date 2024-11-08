import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    firstName: {
      type: String,
      required: [true, "Tên bệnh nhân là bắt buộc!"],
    },
    lastName: {
      type: String,
      required: [true, "Họ bệnh nhân là bắt buộc!"],
    },
    dob: {
      type: Date,
      required: [true, "Ngày sinh của bệnh nhân là bắt buộc!"],
    },
    gender: {
      type: String,
      required: [true, "Giới tính của bệnh nhân là bắt buộc!"],
      enum: ["Nam", "Nữ"],
    },
  },
  examinationDate: {
    type: Date,
    required: [true, "Ngày khám là bắt buộc!"],
    default: Date.now,
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Tên bác sĩ là bắt buộc!"],
    },
    lastName: {
      type: String,
      required: [true, "Họ bác sĩ là bắt buộc!"],
    },
    department: {
      type: String,
      required: [true, "Khoa là bắt buộc!"],
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  diagnosis: {
    type: String,
    required: [true, "Chuẩn đoán là bắt buộc!"],
  },
  prescriptions: [
    {
      medicineName: {
        type: String,
        required: [true, "Tên thuốc là bắt buộc!"],
      },
      dosage: {
        type: Number,
        required: [true, "Liều lượng là bắt buộc!"],
      },
      unit: {
        type: String,
        required: [true, "Đơn vị là bắt buộc!"],
        enum: ["viên", "gói", "ống"],
        default: "viên",
      },
    },
  ],
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);