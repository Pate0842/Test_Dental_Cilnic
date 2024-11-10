import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailsMedicalRecord = () => {
  const { id } = useParams(); // Lấy ID của hồ sơ bệnh án từ URL
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [appointments, setAppointments] = useState([]); // State lưu danh sách lịch hẹn

  useEffect(() => {
    const fetchMedicalRecordDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/medicalrecord/get/${id}`, {
          withCredentials: true,
        });
        setMedicalRecord(res.data.record);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin hồ sơ bệnh án:", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/appointment/getuserappointments", {
          withCredentials: true,
        });
        setAppointments(res.data.appointments); // Lưu danh sách lịch hẹn
      } catch (err) {
        console.error("Lỗi khi lấy thông tin lịch hẹn:", err);
      }
    };

    fetchMedicalRecordDetails();
    fetchAppointments(); // Lấy danh sách lịch hẹn
  }, [id]);

  if (!medicalRecord) {
    return <div>Đang tải...</div>;
  }

  // Tìm lịch hẹn phù hợp từ danh sách appointments
  const appointment = appointments.find(
    (appointment) => appointment._id === medicalRecord.appointmentId
  );

  return (
    <div className="medical-record-details">
      <h2>Chi Tiết Hồ Sơ Bệnh Án</h2>
      <h3>Thông Tin Bệnh Nhân và Lịch Hẹn</h3>
      <table>
        <tbody>
          {appointment ? (
            <>
            <tr>
                <th>Họ Và Tên</th>
                <td>{appointment.firstName + " " + appointment.lastName}</td>
              </tr>
              <tr>
                <th>Ngày Sinh</th>
                <td>{appointment.dob}</td>
              </tr>
              <tr>
                <th>Giới Tính</th>
                <td>{appointment.gender}</td>
              </tr>
              
              <tr>
                <th>Số Điện Thoại</th>
                <td>{appointment.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{appointment.email}</td>
              </tr>
              <tr>
                <th>Ngày Hẹn</th>
                <td>{new Date(appointment.appointment_date).toLocaleDateString("vi-VN")}</td>
              </tr>
              <tr>
                <th>Khoa</th>
                <td>{appointment.department}</td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan="2">Không có lịch hẹn phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Hiển thị danh sách các lịch hẹn */}
      <h3>Danh Sách Lịch Hẹn</h3>
      {appointments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Ngày Hẹn</th>
              <th>Khoa</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>{new Date(appointment.appointment_date).toLocaleDateString("vi-VN")}</td>
                <td>{appointment.department}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có lịch hẹn nào.</p>
      )}

      {/* Thông tin bác sĩ */}
      <h3>Thông Tin Bác Sĩ</h3>
      <table>
        <tbody>
          <tr>
            <th>Họ Tên Bác Sĩ</th>
            <td>{`${medicalRecord.doctor.firstName} ${medicalRecord.doctor.lastName}`}</td>
          </tr>
          <tr>
            <th>Khoa</th>
            <td>{medicalRecord.doctor.department}</td>
          </tr>
        </tbody>
      </table>

      {/* Thông tin hồ sơ bệnh án */}
      <h3>Thông Tin Hồ Sơ Bệnh Án</h3>
      <table>
        <tbody>
          <tr>
            <th>Ngày Khám</th>
            <td>{new Date(medicalRecord.examinationDate).toLocaleDateString("vi-VN")}</td>
          </tr>
          <tr>
            <th>Chẩn Đoán</th>
            <td>{medicalRecord.diagnosis}</td>
          </tr>
        </tbody>
      </table>

      {/* Đơn thuốc */}
      <h3>Đơn Thuốc:</h3>
      <ul>
        {medicalRecord.prescriptions.map((prescription) => (
          <li key={prescription._id}>
            <span className="medicine">{prescription.medicineName}</span> : 
            <span className="dosage-info">{prescription.dosage} {prescription.unit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailsMedicalRecord;
