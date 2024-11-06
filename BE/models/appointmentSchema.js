import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    lastName: {
      type: String,
      required: [true, "Họ Là Bắt Buộc!"],
      minLength: [2, "Họ Phải Có Ít Nhất 2 Ký Tự!"],
    },
    firstName: {
      type: String,
      required: [true, "Tên Là Bắt Buộc!"],
      minLength: [2, "Tên Phải Có Ít Nhất 2 Ký Tự!"],
    },
    email: {
      type: String,
      required: [true, "Email Là Bắt Buộc!"],
      validate: [validator.isEmail, "Cung Cấp Một Email Hợp Lệ!"],
    },
    phone: {
      type: String,
      required: [true, "Số Điện Thoại Là Bắt Buộc!"],
      minLength: [10, "Số Điện Thoại Phải Có Đúng 10 Ký Tự!"],
      maxLength: [10, "Số Điện Thoại Phải Có Đúng 10 Ký Tự!"],
    },
    cccd: {
      type: String,
      required: [true, "Số CCCD Là Bắt Buộc!"],
      minLength: [12, "Số CCCD Phải Có Đúng 12 Ký Tự!"],
      maxLength: [12, "Số CCCD Phải Có Đúng 12 Ký Tự!"],
    },
    dob: {
      type: Date,
      required: [true, "Ngày Sinh Là Bắt Buộc!"],
    },
    gender: {
      type: String,
      required: [true, "Giới Tính Là Bắt Buộc!"],
      enum: ["Nam", "Nữ"],
    },
    appointment_date: {
      type: Date,
      required: [true, "Ngày Hẹn Là Bắt Buộc!"],
    },
    department: {
      type: String,
      required: [true, "Department Name Is Required!"],
    },
    doctor: {
      firstName: {
        type: String,
        required: [true, "Tên Bác Sĩ Là Bắt Buộc!"],
      },
      lastName: {
        type: String,
        required: [true, "Họ Bác Sĩ Là Bắt Buộc!"],
      },
    },
    hasVisited: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: [true, "Địa Chỉ Là Bắt Buộc!"],
    },
    doctorId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Đang Chờ", "Đã Chấp Nhận", "Đã Từ Chối"],
      default: "Đang Chờ",
    },
});
 
export const Appointment = mongoose.model("Appointment", appointmentSchema);

