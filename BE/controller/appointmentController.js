import {catchAsyncErrors} from '../middlewares/catchAsyncError.js'
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      cccd,
      dob,
      gender,
      appointment_date,
      department,
      doctor_firstName,
      doctor_lastName,
      hasVisited,
      address
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !cccd ||
      !dob ||
      !gender ||
      !appointment_date ||
      !department ||
      !doctor_firstName ||
      !doctor_lastName ||
      !address
    ) {
      return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }
    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Bác sĩ",
        doctorDepartment: department,
    });
    if (isConflict.length === 0) {
        return next(new ErrorHandler("Không tìm thấy bác sĩ", 404));
    }
    
    if (isConflict.length > 1) {
        return next(
          new ErrorHandler(
            "Bác sĩ đang bận! Vui lòng liên hệ qua email hoặc điện thoại!",
            400
          )
        );
    }
    const doctorId = isConflict[0]._id;
    const patientId = req.user._id;
    const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        cccd,
        dob,
        gender,
        appointment_date,
        department,
        doctor: {
          lastName: doctor_lastName,
          firstName: doctor_firstName,
        },
        hasVisited,
        address,
        doctorId,
        patientId,
    });
    res.status(200).json({
        success: true,
        message: "Lịch hẹn đã được gửi thành công!",
        appointment
    });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      appointments,
    });
});
export const getUserAppointments = catchAsyncErrors(async (req, res, next) => {
  const patientId = req.user._id; // Lấy ID người dùng đã đăng nhập từ middleware
  console.log("Patient ID:", patientId); // Kiểm tra ID bệnh nhân

  const appointments = await Appointment.find({ patientId }); // Tìm lịch hẹn dựa trên patientId
  console.log("Appointments found:", appointments); // Kiểm tra các lịch hẹn tìm thấy

  if (!appointments || appointments.length === 0) {
    return next(new ErrorHandler("Không tìm thấy lịch hẹn cho bệnh nhân này!", 404));
  }

  res.status(200).json({
      success: true,
      appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
    async (req, res, next) => {
      const { id } = req.params;
      let appointment = await Appointment.findById(id);
      if (!appointment) {
        return next(new ErrorHandler("Không tìm thấy lịch hẹn!", 404));
      }
      appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        success: true,
        message: "Đã cập nhật trạng thái lịch hẹn!",
        appointment
      });
    }
);
  export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Không tìm thấy lịch hẹn!", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
      success: true,
      message: "Đã xóa lịch hẹn!",
      appointment
    });
  });
