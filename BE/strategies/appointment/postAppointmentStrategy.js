import AppointmentStrategy from "./appointmentStrategy.js";
import ErrorHandler from "../../middlewares/errorMiddlewares.js";
import { Appointment } from "../../models/appointmentSchema.js";
import { User } from "../../models/userSchema.js";
import AppointmentBuilder from "../../builder/appointmentBuilder.js";

class PostAppointmentStrategy extends AppointmentStrategy {

  async execute(req, res, next) {
    const {
      firstName, lastName, email, phone, cccd, dob, gender,
      appointment_date, department, doctor_firstName,
      doctor_lastName, hasVisited, address
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !cccd || !dob ||
        !gender || !appointment_date || !department || !doctor_firstName ||
        !doctor_lastName || !address) {
      return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }

    const doctor = await User.findOne({
      firstName: doctor_firstName,
      lastName: doctor_lastName,
      role: "Bác sĩ",
      doctorDepartment: department,
    });

    if (!doctor) {
      return next(new ErrorHandler("Không tìm thấy bác sĩ", 404));
    }

    const patientId = req.user._id;

    // Sử dụng Builder Pattern để tạo đối tượng Appointment
    const appointmentData = new AppointmentBuilder()
      .setPatientInfo(firstName, lastName, email, phone, cccd, dob, gender, address)
      .setDoctorInfo(doctor._id, department, doctor_firstName, doctor_lastName)
      .setAppointmentDate(appointment_date)
      .setPatientId(patientId)
      .setHasVisited(hasVisited)
      .build();

    const appointment = await Appointment.create(appointmentData);

    res.status(200).json({
      success: true,
      message: "Lịch hẹn đã được gửi thành công!",
      appointment,
    });
  }
}

export default new PostAppointmentStrategy();
