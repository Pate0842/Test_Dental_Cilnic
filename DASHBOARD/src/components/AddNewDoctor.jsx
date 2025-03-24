import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

// 🎯 Prototype Object (Mẫu dữ liệu bác sĩ)
const DoctorPrototype = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nic: "",
  dob: "",
  gender: "",
  password: "",
  doctorDepartment: "",
  docAvatar: "",
};

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [doctor, setDoctor] = useState(Object.create(DoctorPrototype)); // Tạo bác sĩ từ prototype
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "NHA NHI",
    "PHẪU THUẬT HÀM MẶT",
    "CHỈNH NHA",
    "NỘI NHA",
    "NHA CHU",
    "CẤY GHÉP NHA KHOA",
    "CHẨN ĐOÁN HÌNH ẢNH",
    "THẪM MỸ NHA KHOA",
    "NHA KHOA PHỤC HÌNH",
  ];

  // ✅ Hàm xử lý nhập dữ liệu (Dùng chung cho tất cả input)
  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Xử lý chọn ảnh đại diện bác sĩ
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDoctor({
        ...doctor,
        docAvatar: file,
      });
    };
  };

  // ✅ Xử lý gửi dữ liệu lên API
  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(doctor).forEach((key) => {
        formData.append(key, doctor[key]);
      });

      await axios
        .post("http://localhost:4000/api/v1/user/doctor/addnew", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setDoctor(Object.create(DoctorPrototype)); // Reset lại form sau khi đăng ký thành công
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <h1 className="form-title">ĐĂNG KÝ BÁC SĨ</h1>
        <form onSubmit={handleAddNewDoctor}>
          <div className="first-wrapper">
            <div>
              <img
                src={docAvatarPreview ? `${docAvatarPreview}` : "/docHolder.jpg"}
                alt="Doctor Avatar"
              />
              <input type="file" onChange={handleAvatar} />
            </div>
            <div>
              <input type="text" name="firstName" placeholder="Họ" value={doctor.firstName} onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Tên" value={doctor.lastName} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" value={doctor.email} onChange={handleChange} />
              <input type="number" name="phone" placeholder="SDT" value={doctor.phone} onChange={handleChange} />
              <input type="number" name="nic" placeholder="CCCD" value={doctor.nic} onChange={handleChange} />
              <input type="date" name="dob" placeholder="Ngày sinh" value={doctor.dob} onChange={handleChange} />
              <select name="gender" value={doctor.gender} onChange={handleChange}>
                <option value="">Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <input type="password" name="password" placeholder="Password" value={doctor.password} onChange={handleChange} />
              <select name="doctorDepartment" value={doctor.doctorDepartment} onChange={handleChange}>
                <option value="">Chuyên khoa</option>
                {departmentsArray.map((depart, index) => (
                  <option value={depart} key={index}>
                    {depart}
                  </option>
                ))}
              </select>
              <button type="submit">Đăng ký</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewDoctor;
