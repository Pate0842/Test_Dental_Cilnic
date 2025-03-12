import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("regular"); // State cho messageType, mặc định là "regular"

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/message/send",
        { firstName, lastName, email, phone, message, messageType }, // Thêm messageType vào dữ liệu gửi
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Hiển thị toast với thông báo từ server, bao gồm details
      toast.success(`${response.data.message} - ${response.data.details}`);
      
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setMessageType("regular"); // Reset messageType về mặc định
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi!");
    }
  };

  return (
    <>
      <div className="container form-component message-form">
        <h2>Gửi cho chúng tôi một tin nhắn</h2>
        <form onSubmit={handleMessage}>
          <div>
            <input
              type="text"
              placeholder="Họ"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Tên"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email" // Thay đổi type thành "email" để hỗ trợ kiểm tra định dạng
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Số Điện Thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              pattern="[0-9]{10}" // Đảm bảo chỉ nhận 10 chữ số
              required
            />
          </div>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            required
            style={{ padding: "10px 40px", borderRadius: "7px", border: "1px solid gray", fontSize: "24px" }}
          >
            <option value="regular">Tin nhắn thông thường</option>
            <option value="urgent">Tin nhắn khẩn cấp</option>
            <option value="confirmation">Tin nhắn xác nhận</option>
          </select>
          <textarea
            rows={7}
            placeholder="Lời Nhắn"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Gửi</button>
          </div>
        </form>
        <img src="/Vector.png" alt="vector" />
      </div>
    </>
  );
};

export default MessageForm;