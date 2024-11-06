import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Profile = () => {
  const { user, setUser } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",  // Display the current NIC but make it read-only
    dob: "",
    gender: "",
  });

  // Cập nhật formData mỗi khi user thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        nic: user.nic || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:4000/api/v1/user/patient/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Thông tin đã được cập nhật thành công.");
      setUser(res.data.user); // Cập nhật lại user trong Context
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response.data.message || "Có lỗi xảy ra.");
    }
  };

  // Hàm xử lý nút Hủy
  const handleCancel = () => {
    setIsEditing(false); // Đóng chế độ chỉnh sửa
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      nic: user.nic || "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      gender: user.gender || "",
    }); // Khôi phục lại dữ liệu ban đầu
  };

  return (
    <div className="page-content">
      <section className="profile-page">
        <h2>Thông tin cá nhân</h2>
        <p>Họ và Tên: 
          {isEditing ? (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Họ"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tên"
              />
            </>
          ) : (
            `${user.firstName} ${user.lastName}`
          )}
        </p>
        <p>Email: 
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          ) : (
            user.email
          )}
        </p>
        <p>Số điện thoại: 
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số điện thoại"
            />
          ) : (
            user.phone || "Không có thông tin"
          )}
        </p>
        <p>CCCD: 
          {isEditing ? (
            <input
              type="text"
              name="nic"
              value={formData.nic}
              readOnly  // Make NIC field read-only
            />
          ) : (
            user.nic || "Không có thông tin"
          )}
        </p>
        <p>Ngày/Tháng/Năm: 
          {isEditing ? (
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="Ngày/Tháng/Năm"
            />
          ) : (
            formatDate(user.dob)
          )}
        </p>
        <p>Giới tính: 
          {isEditing ? (
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Chọn Giới Tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          ) : (
            user.gender || "Không có thông tin"
          )}
        </p>
        {isEditing ? (
          <>
            <button onClick={handleSave}>Lưu</button>
            <button onClick={handleCancel}>Hủy</button> {/* Nút Hủy */}
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
        )}
      </section>
    </div>
  );
};

export default Profile;
