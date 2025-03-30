class NotificationVisitor {
    async visitEmailObserver(observer, appointment) {
      throw new Error("Phương thức visitEmailObserver phải được triển khai");
    }
  }
  
  // Visitor cho email
  class EmailVisitor extends NotificationVisitor {
    async visitEmailObserver(observer, appointment) {
      try {
        const emailOptions = {
          email: appointment.email,
          subject: "Cập nhật trạng thái lịch hẹn",
          message: `Lịch hẹn của bạn đã được cập nhật thành: ${appointment.status}`,
        };
        const sendEmail = (await import("../../utils/sendEmail.js")).default;
        await sendEmail(emailOptions);
        console.log(`Email sent to ${appointment.email} about status: ${appointment.status}`);
      } catch (error) {
        console.error(`Failed to send email for appointment ${appointment._id}:`, error.message);
      }
    }
  }
  
  
  export { NotificationVisitor, EmailVisitor };