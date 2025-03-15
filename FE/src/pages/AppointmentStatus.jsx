import { useEffect, useState, useContext } from "react";
import { Context } from "../main";
import AppointmentFacade from "../utils/AppointmentFacade.jsx";

const AppointmentStatus = () => {
  const { user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      // Facade Pattern: Sử dụng AppointmentFacade.fetchUserAppointments() để đơn giản hóa việc lấy danh sách lịch hẹn
      const appointmentsData = await AppointmentFacade.fetchUserAppointments();
      setAppointments(appointmentsData);
    };
    loadAppointments();
  }, [user]);

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
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Không có lịch hẹn nào.
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="name-column">{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td
                      style={{
                        color:
                          appointment.status === "Đang Chờ"
                            ? "orange"
                            : appointment.status === "Đã Chấp Nhận"
                            ? "green"
                            : appointment.status === "Đã Từ Chối"
                            ? "red"
                            : "black",
                      }}
                    >
                      {appointment.status || "Đang chờ"}
                    </td>
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