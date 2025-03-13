import AppointmentStrategy from "./appointmentStrategy.js";
import { Appointment } from "../../models/appointmentSchema.js";
import AppointmentsCollection from "../../iterators/appointmentsCollection.js";

class GetAllAppointmentsStrategy extends AppointmentStrategy {
  async execute(req, res, next) {
    try {
      // Lấy danh sách lịch hẹn từ database
      const appointmentsData = await Appointment.find();

      // Tạo Collection và Iterator
      const appointmentsCollection = new AppointmentsCollection(appointmentsData);
      const iterator = appointmentsCollection.createIterator();

      // Duyệt danh sách bằng Iterator
      let appointments = [];
      while (iterator.hasNext()) {
        appointments.push(iterator.next());
      }

      // Trả về dữ liệu
      res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GetAllAppointmentsStrategy();
