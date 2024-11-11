import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const CreateMedicalRecord = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(Context);

  const [appointment, setAppointment] = useState(null);
  const [prescriptions, setPrescriptions] = useState([{ name: "", quantity: 1, unit: "", usage: "" }]);
  const [suggestions, setSuggestions] = useState([]);
  const [focusedRow, setFocusedRow] = useState(null); // Track which row is focused
  const limitedSuggestions = suggestions.slice(0, 100);
  const { state } = useLocation();  // Lấy dữ liệu setAppointments từ Dashboard
  const { setAppointments } = state || {};  // Gán setAppointments nếu có

  const medicines = [
    { name: "Paracetamol", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Ibuprofen", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Aspirin", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Vitamin C", unit: "Viên", usage: "Tối 1 sáng 1" },
    { name: "Amoxicillin", unit: "Viên", usage: "Tối 1 sáng 1" },
  ];

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/appointment/getAppointmentId/${appointmentId}`,
          { withCredentials: true }
        );
        if (data.success) {
          setAppointment(data.appointment);
        } else {
          toast.error(data.message || "Lỗi khi lấy cuộc hẹn.");
        }
      } catch (error) {
        toast.error("Không thể tải cuộc hẹn.");
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const medicalRecord = {
      appointmentId: appointment._id,
      examinationDate: e.target.examinationDate.value,
      diagnosis: e.target.diagnosis.value,
      prescriptions: prescriptions.map((prescription) => ({
        medicineName: prescription.name,
        dosage: prescription.quantity,
        unit: prescription.unit,
        usage: prescription.usage,
      })),
    };
  
    try {
      const response = await axios.post("http://localhost:4000/api/v1/medicalRecord/post", medicalRecord, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.data.success) {
        toast.success("Đơn thuốc đã được tạo thành công!");
  
        // Update the appointments list in Dashboard after success
        if (setAppointments) {
          setAppointments((prevAppointments) =>
            prevAppointments.filter((appointment) => appointment._id !== appointmentId)
          );
        }
  
        navigate("/"); // Navigate after success
      }
    } catch (error) {
      toast.error("Đã có lỗi khi tạo đơn thuốc.");
      console.error("Error:", error);
    }
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;

    if (field === "name" && value.trim() !== "") {
      const filteredSuggestions = medicines.filter((medicine) =>
        medicine.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setFocusedRow(index); // Set focus to current row
    } else {
      setFocusedRow(null); // Remove focus if input is empty
    }

    setPrescriptions(updatedPrescriptions);
  };

  const handleSuggestionClick = (index, medicine) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index].name = medicine.name;
    updatedPrescriptions[index].usage = medicine.usage;
    updatedPrescriptions[index].unit = medicine.unit;
    setPrescriptions(updatedPrescriptions);
    setSuggestions([]);
    setFocusedRow(null);
  };

  const addPrescription = () => {
    if (prescriptions.length < 10) {
      setPrescriptions([...prescriptions, { name: "", quantity: 1, unit: "", usage: "" }]);
    }
  };

  const deletePrescription = (index) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);
  };

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <h1 className="form-title">CẬP NHẬT BÁC SĨ</h1>
        {appointment ? (
          <form onSubmit={handleSubmit}>
            <div className="first-wrapper">
              <div>
                <input
                  type="text"
                  placeholder="Họ"
                  value={appointment.firstName || ""}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Tên"
                  value={appointment.lastName || ""}
                  readOnly
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={appointment.phone || ""}
                  readOnly
                />
                <input
                  type="date"
                  placeholder="Ngày sinh"
                  value={appointment.dob ? appointment.dob.substring(0, 10) : ""}
                  readOnly
                />
                <select value={appointment.gender || ""} disabled>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                <textarea name="diagnosis" placeholder="Chẩn đoán" required></textarea>
                <input
                  type="date"
                  name="examinationDate"
                  placeholder="Ngày khám"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  required
                />

                <table>
                  <thead>
                    <tr>
                      <th>Số thứ tự</th>
                      <th>Tên thuốc</th>
                      <th>Số lượng</th>
                      <th>Đơn vị tính</th>
                      <th>Cách dùng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription, index) => (
                      <tr key={index}>
                        <td><input type="text" value={index + 1} readOnly /></td>
                        <td>
                          <input
                            type="text"
                            value={prescription.name}
                            onChange={(e) => handlePrescriptionChange(index, "name", e.target.value)}
                            placeholder="Tên thuốc"
                            required
                          />
                          {focusedRow === index && limitedSuggestions.length > 0 && (
                            <ul className="suggestions-list">
                              {limitedSuggestions.map((medicine, i) => (
                                <li
                                  key={i}
                                  className="suggestion-item"
                                  onMouseDown={() => handleSuggestionClick(index, medicine)}
                                >
                                  {medicine.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>

                        <td>
                          <input
                            type="number"
                            value={prescription.quantity}
                            onChange={(e) => handlePrescriptionChange(index, "quantity", e.target.value)}
                            min={1}
                            step={1}
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={prescription.unit}
                            onChange={(e) => handlePrescriptionChange(index, "unit", e.target.value)}
                            placeholder="Đơn vị tính"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={prescription.usage}
                            onChange={(e) => handlePrescriptionChange(index, "usage", e.target.value)} // Update usage
                            placeholder="Liều dùng"
                          />
                        </td>
                        <td>
                          <div className="kedon2 pointer" onClick={() => deletePrescription(index)}>
                            Xóa
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button type="button" onClick={addPrescription}>
                  Thêm thuốc
                </button>

                <button type="submit" className="submit">
                  Cập nhật đơn thuốc
                </button>
              </div>
            </div>
          </form>
        ) : (
          <p>Đang tải thông tin cuộc hẹn...</p>
        )}
      </section>
    </section>
  );
};

export default CreateMedicalRecord; 