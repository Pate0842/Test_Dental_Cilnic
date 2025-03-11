import AppointmentStrategy from "./appointmentStrategy.js";
import { Appointment } from "../../models/appointmentSchema.js";
import ErrorHandler from "../../middlewares/errorMiddlewares.js";

class UpdateAppointmentStatusStrategy extends AppointmentStrategy {
  async execute(req, res, next) {
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
      appointment,
    });
  }
}

export default new UpdateAppointmentStatusStrategy();
