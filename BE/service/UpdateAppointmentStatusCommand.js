import Command from "./Command.js";
import { Appointment } from "../models/appointmentSchema.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

class UpdateAppointmentStatusCommand extends Command {
  constructor(id, newStatus) {
    super();
    this.id = id;
    this.newStatus = newStatus;
    this.previousStatus = null;
  }

  async execute(req, res, next) {
    try {
      const appointment = await Appointment.findById(this.id);

      if (!appointment) {
        return next(new ErrorHandler("Không tìm thấy lịch hẹn!", 404));
      }

      this.previousStatus = appointment.status; // Lưu trạng thái cũ để có thể hoàn tác

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        this.id,
        { status: this.newStatus },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "Đã cập nhật trạng thái lịch hẹn!",
        appointment: updatedAppointment,
      });
    } catch (error) {
      next(error);
    }
  }

  async undo(req, res, next) {
    try {
      if (this.previousStatus !== null) {
        const revertedAppointment = await Appointment.findByIdAndUpdate(
          this.id,
          { status: this.previousStatus },
          { new: true, runValidators: true }
        );

        res.status(200).json({
          success: true,
          message: "Hoàn tác trạng thái lịch hẹn thành công!",
          appointment: revertedAppointment,
        });
      } else {
        return next(new ErrorHandler("Không thể hoàn tác!", 400));
      }
    } catch (error) {
      next(error);
    }
  }
}

export default UpdateAppointmentStatusCommand;
