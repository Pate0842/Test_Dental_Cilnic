import sendEmail from '../../utils/sendEmail.js';

class EmailObserver {
  async update(appointment) {
    try {
      console.log('EmailObserver received appointment:', appointment);
      if (!appointment || !appointment.email) {
        console.log(`No valid email found for appointment ${appointment?._id || 'unknown'}`);
        return;
      }

      const emailOptions = {
        email: appointment.email,
        subject: 'Cập nhật trạng thái lịch hẹn',
        message: `Lịch hẹn của bạn đã được cập nhật thành: ${appointment.status}`,
      };

      await sendEmail(emailOptions);
      console.log(`Email sent to ${appointment.email} about status: ${appointment.status}`);
    } catch (error) {
      console.error(`Failed to send email for appointment ${appointment?._id || 'unknown'}:`, error.message);
    }
  }
}

export default EmailObserver;