import { EmailVisitor } from "./NotificationVisitor.js";

class EmailObserver {
  constructor() {
    this.visitors = [
      new EmailVisitor(),
    ];
  }

  async update(appointment) {
    try {
      if (!appointment || !appointment.email) {
        return;
      }

      // Duyệt qua danh sách visitor và thực hiện thông báo
      for (const visitor of this.visitors) {
        await visitor.visitEmailObserver(this, appointment);
      }
    } catch (error) {
      console.error(`Failed to process appointment ${appointment?._id || "unknown"}:`, error.message);
    }
  }
}

export default EmailObserver;