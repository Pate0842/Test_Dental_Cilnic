import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, setUser } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        nic: user.nic || "",
        dob: formatDate(user.dob),
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const handleSave = async () => {
    try {
      const userId = user._id;
      const res = await axios.put(
        `http://localhost:4000/api/v1/user/patients/update/${userId}`,
        profileData,
        { withCredentials: true }
      );
  
      // Log toàn bộ dữ liệu trả về từ server
      console.log("Response from server:", res.data); 
  
      // Kiểm tra dữ liệu trả về có chứa trường updatedUser
      console.log("User data:", res.data.updatedUser); 
  
      toast.success("Thông tin đã được cập nhật!");
      setIsEditing(false);
  
      // Log và kiểm tra lại dữ liệu của người dùng được cập nhật từ server
      console.log("Updated user from server:", res.data.updatedUser);
  
      // Cập nhật user trong context
      if (res.data.updatedUser) {
        setUser(res.data.updatedUser);  // Cập nhật thông tin người dùng trong context
      } else {
        console.error("Không có dữ liệu updatedUser từ server");
      }
    } catch (err) {
      // Xử lý lỗi khi có lỗi xảy ra
      toast.error(err.response?.data?.message || "Đã có lỗi xảy ra!");
    }
  };
  
  

  const handleCancel = () => {
    setProfileData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      nic: user.nic || "",
      dob: formatDate(user.dob),
      gender: user.gender || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="page-content">
      <section className="Profile page">
        <div className="img-container">
          <img src="/thay-ba-1.jpg" alt="Profile" />
          <div className="text-profile">
            Chào mừng bạn đến với Bệnh viện Nha khoa của chúng tôi, nơi chúng tôi cam kết mang đến sự chăm sóc toàn diện và tận tâm nhất cho nụ cười của bạn. Với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại và công nghệ tiên tiến, chúng tôi cung cấp đa dạng dịch vụ từ cạo vôi, trám răng đến chỉnh nha, trồng răng implant. Sức khỏe và sự hài lòng của bạn là ưu tiên hàng đầu, và chúng tôi luôn tạo ra môi trường thân thiện, thoải mái để bạn cảm thấy an tâm trong suốt quá trình điều trị. Hãy để chúng tôi đồng hành cùng bạn trong hành trình bảo vệ và nâng tầm nụ cười của bạn!
          </div>
        </div>
        <div className="bannerstatus">
          <h5>Thông Tin Cá Nhân</h5>
          <form>
            <div className="form-group">
              <label>Họ và Tên:</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <input
                type="text"
                name="lastName"
                value={profileData.lastName || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={profileData.email || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Số Điện Thoại:</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>CCCD:</label>
              <input
                type="text"
                name="nic"
                value={profileData.nic || ""}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Ngày/Tháng/Năm:</label>
              <input
                type="date"
                name="dob"
                value={profileData.dob || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Giới Tính:</label>
              <select
                name="gender"
                value={profileData.gender || ""}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="form-actions">
              {isEditing ? (
                <>
                  <button type="button" onClick={handleCancel}>Hủy</button>
                  <button type="button" onClick={handleSave}>Lưu</button>
                </>
              ) : (
                <button type="button" onClick={handleEditToggle}>Chỉnh sửa</button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;