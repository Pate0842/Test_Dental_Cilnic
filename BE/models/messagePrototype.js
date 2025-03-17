import { Message } from "./messageSchema.js";

class MessagePrototype {
  constructor(message) {
    this.firstName = message.firstName;
    this.lastName = message.lastName;
    this.email = message.email;
    this.phone = message.phone;
    this.message = message.message;
    this.type = message.type || "regular";
  }

  // Hàm clone để tạo bản sao tin nhắn
  clone() {
    return new MessagePrototype(this);
  }

  // Chuyển dữ liệu về định dạng lưu vào MongoDB
  getMessageData() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      message: this.message,
      type: this.type,
    };
  }

  static async cloneFromMessageId(messageId) {
    const message = await Message.findById(messageId);
    if (!message) throw new Error("Không tìm thấy tin nhắn để sao chép!");

    return new MessagePrototype(message);
  }
}

export default MessagePrototype;
