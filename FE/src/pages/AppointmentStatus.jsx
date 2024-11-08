import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";

const AppointmentStatus = () => {
  const { user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/appointment/getuserappointments", {
        withCredentials: true,
      });
      // Sắp xếp các lịch hẹn theo thứ tự giảm dần (mới nhất trước)
      const sortedAppointments = res.data.appointments.sort((a, b) => 
        new Date(b.appointment_date) - new Date(a.appointment_date)
      );
      setAppointments(sortedAppointments);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đã có lỗi xảy ra!");
    }
  };

  return (
    <div className="page-content">
      <section className="AppointmentStatus page">
        <div className="bannerstatus">
          <h5>Trạng Thái Lịch Hẹn</h5>
          <table>
            <thead>
              <tr>
                <th>Họ và Tên</th>
                <th>Ngày</th>
                <th>Bác sĩ</th>
                <th>Department</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>Không có lịch hẹn nào.</td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>{appointment.status || "Đang chờ"}</td> {/* Mặc định là "Đang chờ" nếu không có trạng thái */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AppointmentStatus;