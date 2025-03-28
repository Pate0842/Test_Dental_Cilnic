import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppointmentFacade from "../utils/AppointmentFacade.jsx";

// Các mã tỉnh hợp lệ cho CCCD (lấy từ schema của bạn)
const validProvinces = [
  "001", "002", "004", "006", "008", "010", "011", "012", "014", "015",
  "017", "019", "020", "022", "024", "025", "026", "027", "030", "031",
  "033", "034", "035", "036", "037", "038", "040", "042", "044", "045",
  "046", "048", "049", "051", "052", "054", "056", "058", "060", "062",
  "064", "066", "067", "068", "070", "072", "074", "075", "077", "079",
  "080", "082", "083", "084", "086", "087", "089", "091", "092", "093",
  "094", "095", "096"
];

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cccd, setcccd] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("NHA NHI");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [doctors, setDoctors] = useState([]);

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

  useEffect(() => {
    const loadDoctors = async () => {
      const doctorsData = await AppointmentFacade.fetchDoctors();
      setDoctors(doctorsData);
      console.log(doctorsData);
    };
    loadDoctors();
  }, []);

  const handleDobChange = (e) => {
    setDob(AppointmentFacade.validateDate(e.target.value, true));
  };

  const handleAppointmentDateChange = (e) => {
    setAppointmentDate(AppointmentFacade.validateDate(e.target.value));
  };

  const validateCCCD = (cccdValue, dobValue, genderValue) => {
    // Kiểm tra độ dài và định dạng cơ bản
    if (!cccdValue || cccdValue.length !== 12 || !/^\d{12}$/.test(cccdValue)) {
      toast.error("CCCD phải là 12 chữ số!");
      return false;
    }

    const provinceCode = cccdValue.substring(0, 3);
    const genderCode = cccdValue[3];
    const birthYearCode = cccdValue.substring(4, 6);
    const randomDigits = cccdValue.substring(6);

    // Kiểm tra mã tỉnh
    if (!validProvinces.includes(provinceCode)) {
      toast.error("Mã tỉnh trong CCCD không hợp lệ!");
      return false;
    }

    // Kiểm tra 6 số ngẫu nhiên cuối
    if (!/^\d{6}$/.test(randomDigits)) {
      toast.error("6 ký tự cuối của CCCD phải là số!");
      return false;
    }

    // Chuyển dob thành đối tượng Date
    const dobDate = new Date(dobValue);
    if (isNaN(dobDate.getTime())) {
      toast.error("Ngày sinh không hợp lệ!");
      return false;
    }

    // Lấy năm sinh từ dob
    const birthYear = dobDate.getFullYear().toString().slice(-2);
    if (birthYear !== birthYearCode) {
      toast.error("Năm sinh trong DOB không khớp với CCCD!");
      return false;
    }

    // Xác định thế kỷ và mã giới tính mong đợi
    const birthCentury = Math.floor((dobDate.getFullYear() - 1) / 100) + 1;
    const genderCenturyMap = {
      20: { male: "0", female: "1" },
      21: { male: "2", female: "3" },
      22: { male: "4", female: "5" },
      23: { male: "6", female: "7" },
    };

    const centuryKey = birthCentury.toString();
    const expectedGenderCode = genderCenturyMap[centuryKey]
      ? genderCenturyMap[centuryKey][genderValue === "Nam" ? "male" : "female"]
      : null;

    if (!expectedGenderCode || expectedGenderCode !== genderCode) {
      toast.error("Giới tính không khớp với CCCD! Vui lòng kiểm tra lại.");
      return false;
    }

    return true;
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !cccd || !dob || !gender || !appointmentDate || !department || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!validateCCCD(cccd, dob, gender)) {
      return;
    }

    const appointmentData = {
      firstName,
      lastName,
      email,
      phone,
      cccd,
      dob,
      gender,
      appointmentDate,
      department,
      doctor_firstName: doctorFirstName,
      doctor_lastName: doctorLastName,
      hasVisited,
      address,
    };

    const success = await AppointmentFacade.createAppointment(appointmentData);
    if (success) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setcccd("");
      setDob("");
      setGender("");
      setAppointmentDate("");
      setDepartment("NHA NHI");
      setDoctorFirstName("");
      setDoctorLastName("");
      setHasVisited(false);
      setAddress("");
    }
  };

  return (
    <>
      <div className="container form-component appointment-form">
        <h2>Đặt Lịch Hẹn</h2>
        <form onSubmit={handleAppointment}>
          <div>
            <input
              type="text"
              placeholder="Họ"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tên"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Số Điện Thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="CCCD (12 chữ số)"
              value={cccd}
              onChange={(e) => setcccd(e.target.value)}
            />
            <input
              type="date"
              placeholder="Ngày/Tháng/Năm"
              value={dob}
              onChange={handleDobChange}
            />
          </div>
          <div>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Chọn Giới Tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <input
              type="date"
              placeholder="Ngày Hẹn"
              value={appointmentDate}
              onChange={handleAppointmentDateChange}
            />
          </div>
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart, index) => (
                <option value={depart} key={index}>
                  {depart}
                </option>
              ))}
            </select>
            <select
              value={`${doctorFirstName} ${doctorLastName}`}
              onChange={(e) => {
                const [firstName, lastName] = e.target.value.split(" ");
                setDoctorFirstName(firstName);
                setDoctorLastName(lastName);
              }}
              disabled={!department}
            >
              <option value="">Chọn Bác Sĩ</option>
              {doctors
                .filter((doctor) => doctor.doctorDepartment === department)
                .map((doctor, index) => (
                  <option
                    value={`${doctor.firstName} ${doctor.lastName}`}
                    key={index}
                  >
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
            </select>
          </div>
          <textarea
            rows="10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Địa Chỉ"
          />
          <div
            style={{
              gap: "10px",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          ></div>
          <button style={{ margin: "0 auto" }}>Đặt lịch</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;