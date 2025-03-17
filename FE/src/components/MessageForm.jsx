import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const MessageForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("regular");
  const [loading, setLoading] = useState(false);

  // Khi nhập email, kiểm tra trên database
  const handleEmailBlur = async () => {
    if (!email) return; // Không có email thì không request

    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/message/findByEmail?email=${email}`
      );

      if (data) {
        // ⭐ Prototype Pattern: Clone dữ liệu từ tin nhắn trước đó
        setFirstName(data.firstName || "");  // Clone họ
        setLastName(data.lastName || "");    // Clone tên
        setPhone(data.phone || "");          // Clone số điện thoại
        setMessage(data.message || "");      // Clone nội dung tin nhắn
        setMessageType(data.messageType || "regular"); // Clone loại tin nhắn

        toast.info("Đã tự động điền tin nhắn gần nhất của bạn."); // Thông báo khi clone dữ liệu
      }
    } catch (error) {
      toast.warn("Email này chưa từng gửi tin nhắn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-component message-form">
      <h2>Gửi cho chúng tôi một tin nhắn</h2>

      <form>
        <div>
          <input type="text" placeholder="Họ" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Tên" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur} // Khi rời khỏi ô input, kiểm tra email
            required
          />
          <input type="tel" placeholder="Số Điện Thoại" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <select value={messageType} onChange={(e) => setMessageType(e.target.value)} required>
          <option value="regular">Tin nhắn thông thường</option>
          <option value="urgent">Tin nhắn khẩn cấp</option>
          <option value="confirmation">Tin nhắn xác nhận</option>
        </select>
        <textarea rows={7} placeholder="Lời Nhắn" value={message} onChange={(e) => setMessage(e.target.value)} required />
        <div>
          <button type="submit" disabled={loading}>{loading ? "Đang tải..." : "Gửi"}</button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
