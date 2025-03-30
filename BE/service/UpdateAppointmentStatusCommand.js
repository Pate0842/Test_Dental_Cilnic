import Command from "./Command.js";
import { Appointment } from "../models/appointmentSchema.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import AppointmentSubject from "./AppointmentSubject.js";
import EmailObserver from "./observers/EmailObserver.js";

class UpdateAppointmentStatusCommand extends Command {
  constructor(id, newStatus) {
    super();
    this.id = id;
    this.newStatus = newStatus;
    this.previousStatus = null;
    this.subject = new AppointmentSubject();

    this.subject.attach(new EmailObserver());
  }

  async execute(req, res, next) {
    try {
      const appointment = await Appointment.findById(this.id);
      if (!appointment) {
        return next(new ErrorHandler("Không tìm thấy lịch hẹn!", 404));
      }

      this.previousStatus = appointment.status;

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        this.id,
        { status: this.newStatus },
        { new: true, runValidators: true }
      );

      if (!updatedAppointment) {
        return next(new ErrorHandler("Không thể cập nhật lịch hẹn!", 500));
      }

      console.log("Updated Appointment:", updatedAppointment);
      await this.subject.setAppointment(updatedAppointment);

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
      if (this.previousStatus === null) {
        return next(new ErrorHandler("Không thể hoàn tác!", 400));
      }

      const revertedAppointment = await Appointment.findByIdAndUpdate(
        this.id,
        { status: this.previousStatus },
        { new: true, runValidators: true }
      );

      if (!revertedAppointment) {
        return next(new ErrorHandler("Không thể hoàn tác lịch hẹn!", 500));
      }

      console.log("Reverted Appointment:", revertedAppointment);
      await this.subject.setAppointment(revertedAppointment);

      res.status(200).json({
        success: true,
        message: "Hoàn tác trạng thái lịch hẹn thành công!",
        appointment: revertedAppointment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UpdateAppointmentStatusCommand;