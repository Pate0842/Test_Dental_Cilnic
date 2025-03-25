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
  const { firstName, lastName, email, phone, message, messageType, cloneFromId } = req.body;

  let messagePrototype;

  // Nếu có cloneFromId, sao chép từ tin nhắn có sẵn
  if (cloneFromId) {
    try {
      messagePrototype = await MessagePrototype.cloneFromMessageId(cloneFromId);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } else {
    messagePrototype = new MessagePrototype({ firstName, lastName, email, phone, message, type: messageType });
  }

  // Lấy factory theo loại tin nhắn
  const factory = getMessageFactory(messagePrototype.type);
  const messageObj = factory.createMessage(messagePrototype.getMessageData());

  // Lưu tin nhắn vào database
  await Message.create(messageObj.getMessageData());

  res.status(200).json({
    success: true,
    message: "Tin nhắn đã được gửi thành công!",
  });
});

//Prototype pattern
export const findMessageByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const lastMessage = await Message.findOne({ email }).sort({ createdAt: -1 });

    if (!lastMessage) return res.status(404).json({ message: "Không tìm thấy tin nhắn" });

    res.json(lastMessage);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

//
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});