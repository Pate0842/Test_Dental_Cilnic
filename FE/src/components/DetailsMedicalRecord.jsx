import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailsMedicalRecord = () => {
  const { id } = useParams();
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [appointment, setAppointment] = useState(null); // Thay appointments bằng appointment
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicalRecordDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/medical-record/getDetail/${id}`, {
          withCredentials: true,
        });
        console.log("Medical Record Data:", res.data.record);
        setMedicalRecord(res.data.record);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi lấy thông tin hồ sơ bệnh án");
      }
    };

    const fetchAppointmentDetails = async (appointmentId) => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/appointment/${appointmentId}`, {
          withCredentials: true,
        });
        console.log("Appointment Data:", res.data.appointment);
        setAppointment(res.data.appointment);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi lấy thông tin lịch hẹn");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchMedicalRecordDetails();
      if (medicalRecord?.appointmentId) {
        await fetchAppointmentDetails(medicalRecord.appointmentId);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!medicalRecord) return <div>Không tìm thấy hồ sơ bệnh án.</div>;

  return (
    <div className="medical-record-details">
      <h2>Chi Tiết Hồ Sơ Bệnh Án</h2>
      {/* <h3>Thông Tin Bệnh Nhân và Lịch Hẹn</h3>
      <table>
        <tbody>
          {appointment ? (
            <>
              <tr>
                <th>Họ Và Tên</th>
                <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
              </tr>
              <tr>
                <th>Ngày Sinh</th>
                <td>{new Date(appointment.dob).toLocaleDateString("vi-VN")}</td>
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
      </table> */}

      <h3>Thông Tin Bác Sĩ</h3>
      <table>
        <tbody>
          <tr>
            <th style={{ width: 324 }}>Họ Tên Bác Sĩ</th>
            <td>
              {medicalRecord.doctor?.firstName && medicalRecord.doctor?.lastName
                ? `${medicalRecord.doctor.firstName} ${medicalRecord.doctor.lastName}`
                : "N/A"}
            </td>
          </tr>
          <tr>
            <th>Khoa</th>
            <td>{medicalRecord.doctor?.department || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <h3>Thông Tin Hồ Sơ Bệnh Án</h3>
      <table>
        <tbody>
          <tr>
            <th style={{ width: 326 }}>Ngày Khám</th>
            <td>{new Date(medicalRecord.examinationDate).toLocaleDateString("vi-VN")}</td>
          </tr>
          <tr>
            <th>Chẩn Đoán</th>
            <td>{medicalRecord.diagnosis || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <h3>Đơn Thuốc:</h3>
      {medicalRecord.prescriptions?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Số Thứ Tự</th>
              <th>Tên Thuốc</th>
              <th>Số Lượng</th>
              <th>Đơn Vị Tính</th>
              <th>Cách Dùng</th>
            </tr>
          </thead>
          <tbody>
            {medicalRecord.prescriptions.map((prescription, index) => (
              <tr key={prescription._id || index}>
                <td>{index + 1}</td>
                <td>{prescription.medicineName || "N/A"}</td>
                <td>{prescription.dosage || "N/A"}</td>
                <td>{prescription.unit || "N/A"}</td>
                <td>{prescription.usage || "Không có hướng dẫn"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có đơn thuốc nào.</p>
      )}
    </div>
  );
};

export default DetailsMedicalRecord;