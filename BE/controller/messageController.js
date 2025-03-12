import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import {
  RegularMessageFactory,
  UrgentMessageFactory,
  ConfirmationMessageFactory,
} from "../factories/messageFactory.js";

// Hàm tiện ích để lấy factory dựa trên loại tin nhắn
const getMessageFactory = (messageType = "regular") => {
  switch (messageType.toLowerCase()) {
    case "regular":
      return new RegularMessageFactory();
    case "urgent":
      return new UrgentMessageFactory();
    case "confirmation":
      return new ConfirmationMessageFactory();
    default:
      throw new Error(`Unsupported message type: ${messageType}`);
  }
};

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message, messageType } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
  }

  // Sử dụng factory để tạo tin nhắn
  const factory = getMessageFactory(messageType); // Lấy factory dựa trên messageType
  const messageData = { firstName, lastName, email, phone, message };
  const messageObj = factory.createMessage(messageData);
  const messageToSave = messageObj.getMessageData();

  // Lưu tin nhắn vào database
  await Message.create(messageToSave);

  // Xử lý bổ sung (nếu cần)
  const processResult = messageObj.process();

  res.status(200).json({
    success: true,
    message: "Tin nhắn đã được gửi thành công!",
    details: processResult, // Có thể bỏ nếu không cần
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});