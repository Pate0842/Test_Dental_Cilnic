import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0); // Thêm trạng thái lưu số lượng cuộc hẹn hôm nay
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const { isAuthenticated, doctor } = useContext(Context);
  const navigate = useNavigate();

  const NullAppointment = {
    _id: "null",
    firstName: "Không có",
    lastName: "lịch hẹn",
    email: "N/A",
    phone: "N/A",
    appointment_date: "N/A",
    status: "Không có cuộc hẹn",
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getallDoctor",
          { withCredentials: true }
        );
  
        // Lọc cuộc hẹn của bác sĩ hiện tại
        const doctorAppointments = data.appointments.filter(
          (appointment) => appointment.doctorId === doctor._id
        );
  
        // Đếm tổng số cuộc hẹn
        setTotalAppointments(doctorAppointments.length);
  
        // Lọc cuộc hẹn đã chấp nhận và chưa xử lý
        const approvedAppointments = doctorAppointments.filter(
          (appointment) =>
            appointment.status === "Đã Chấp Nhận" && !appointment.isProcessed
        );
  
        // Lọc cuộc hẹn trong ngày được chọn
        const filteredAppointments = approvedAppointments.filter((appointment) =>
          appointment.appointment_date.startsWith(selectedDate)
        );
  
        // Nếu không có cuộc hẹn nào trong ngày được chọn, dùng Null Object
        setAppointments(filteredAppointments.length > 0 ? filteredAppointments : [NullAppointment]);
  
        // Đếm số lượng cuộc hẹn hôm nay
        const today = new Date().toISOString().split("T")[0];
        const todayAppointments = approvedAppointments.filter((appointment) =>
          appointment.appointment_date.startsWith(today)
        );
        setTodayAppointmentsCount(todayAppointments.length);
      } catch {
        setAppointments([NullAppointment]);
        setTodayAppointmentsCount(0);
        setTotalAppointments(0);
      }
    };
  
    if (doctor) {
      fetchAppointments();
    }
  }, [doctor, selectedDate]); // Re-fetch khi ngày thay đổi

  const handleCreateMedicalRecord = (appointmentId) => {
    navigate(`/createMedicalRecord/${appointmentId}`);
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello,</p>
                <h5>{doctor && `${doctor.firstName} ${doctor.lastName}`} </h5>
              </div>
            </div>
          </div>
          <div className="secondBox">
            <p>Cuộc hẹn hôm nay</p>
            <h3>{todayAppointmentsCount}</h3> {/* Luôn hiển thị số cuộc hẹn hôm nay */}
          </div>
          <div className="thirdBox">
            <p>Tổng số cuộc hẹn</p>
            <h3>{totalAppointments}</h3>
          </div>
        </div>
        <div className="banner">
          <div className="header">
            <h5>Danh sách khám</h5>
            <input
              type="date"
              className="date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th>Tên bệnh nhân</th>
                <th>Email</th>
                <th>SDT</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
  {appointments.map((appointment) => (
    <tr key={appointment._id}>
      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
      <td>{appointment.email}</td>
      <td>{appointment.phone}</td>
      <td>
        {appointment._id !== "null" ? (
          <a
            className="kedon"
            href=""
            onClick={() => handleCreateMedicalRecord(appointment._id)}
          >
            Kê đơn
          </a>
        ) : (
          <span style={{ color: "gray" }}>Không có lịch khám nào!</span>
        )}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
