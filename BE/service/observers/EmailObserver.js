import { EmailVisitor } from "./NotificationVisitor.js";

class EmailObserver {
  constructor() {
    this.visitors = [
      new EmailVisitor(),
    ];
  }

  async update(appointment) {
    try {
      console.log("EmailObserver received appointment:", appointment);
      if (!appointment || !appointment.email) {
        console.log(`No valid email found for appointment ${appointment?._id || "unknown"}`);
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