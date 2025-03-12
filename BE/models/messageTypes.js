// Abstract Product: Giao diện cho các loại tin nhắn
// Định nghĩa các phương thức mà mọi loại tin nhắn phải triển khai
class MessageType {
    constructor(data) {
      if (this.constructor === MessageType) {
        throw new Error("MessageType là một lớp trừu tượng, không thể khởi tạo trực tiếp!");
      }
      this.data = data;
    }
  
    // Trả về dữ liệu tin nhắn để lưu vào database
    getMessageData() {
      throw new Error("Method 'getMessageData()' must be implemented by subclasses");
    }
  
    // Xử lý logic bổ sung sau khi lưu tin nhắn (ví dụ: gửi thông báo, ghi log)
    process() {
      throw new Error("Method 'process()' must be implemented by subclasses");
    }
  }
  
  // Concrete Product: Tin nhắn thông thường
  class RegularMessage extends MessageType {
    getMessageData() {
      const { firstName, lastName, email, phone, message } = this.data;
      return { firstName, lastName, email, phone, message, type: "regular" };
    }
  
    process() {
      return `Regular message from ${this.data.firstName} ${this.data.lastName} processed successfully.`;
    }
  }
  
  // Concrete Product: Tin nhắn khẩn cấp
  class UrgentMessage extends MessageType {
    getMessageData() {
      const { firstName, lastName, email, phone, message } = this.data;
      return { firstName, lastName, email, phone, message, type: "urgent", priority: true };
    }
  
    process() {
      return `Urgent message from ${this.data.firstName} ${this.data.lastName} processed successfully.`;
    }
  }
  
  // Concrete Product: Tin nhắn xác nhận
  class ConfirmationMessage extends MessageType {
    getMessageData() {
      const { firstName, lastName, email, phone, message } = this.data;
      return { firstName, lastName, email, phone, message, type: "confirmation", confirmedAt: new Date() };
    }
  
    process() {
      return `Confirmation message from ${this.data.firstName} ${this.data.lastName} processed successfully.`;
    }
  }
  
  export { MessageType, RegularMessage, UrgentMessage, ConfirmationMessage };