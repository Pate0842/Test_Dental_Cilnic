import { RegularMessage, UrgentMessage, ConfirmationMessage } from "../models/messageTypes.js";
import { Message } from "../models/messageSchema.js";

// Abstract Factory: Giao diện cho nhà máy tạo tin nhắn
// Định nghĩa phương thức để tạo các loại tin nhắn
class MessageFactory {
  createMessage(data) {
    throw new Error("Method 'createMessage()' must be implemented by concrete factories");
  }
}

// Concrete Factory: Nhà máy tạo tin nhắn thông thường
class RegularMessageFactory extends MessageFactory {
  createMessage(data) {
    return new RegularMessage(data);
  }
}

// Concrete Factory: Nhà máy tạo tin nhắn khẩn cấp
class UrgentMessageFactory extends MessageFactory {
  createMessage(data) {
    return new UrgentMessage(data);
  }
}

// Concrete Factory: Nhà máy tạo tin nhắn xác nhận
class ConfirmationMessageFactory extends MessageFactory {
  createMessage(data) {
    return new ConfirmationMessage(data);
  }
}

export { MessageFactory, RegularMessageFactory, UrgentMessageFactory, ConfirmationMessageFactory };