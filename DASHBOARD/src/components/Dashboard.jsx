import { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/appointment/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const hasVisited = status === "Đã Chấp Nhận"; // Tự động đánh dấu hasVisited
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status, hasVisited },
        { withCredentials: true }
      );
  
      // Cập nhật lại danh sách lịch hẹn trong state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status, hasVisited }
            : appointment
        )
      );
  
      // Gọi fetchAppointments của AppointmentStatus nếu cần
      // Có thể sử dụng một callback hoặc Context để thông báo
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  

  const { isAuthenticated, admin } = useContext(Context);
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
                <p>Hello ,</p>
                <h5>
                  {admin &&
                    `${admin.firstName} ${admin.lastName}`}{" "}
                </h5>
              </div>
              {/* <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Facilis, nam molestias. Eaque molestiae ipsam commodi neque.
                Assumenda repellendus necessitatibus itaque.
              </p> */}
            </div>
          </div>
          <div className="secondBox">
            <p>Tổng số cuộc hẹn</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Tổng số bác sĩ</p>
            <h3>{doctors.length}</h3>
          </div>
        </div>
        <div className="banner">
          <h5>Lịch hẹn</h5>
          <table>
            <thead>
              <tr>
                <th>Tên bệnh nhân</th>
                <th>Ngày hẹn</th>
                <th>Email</th>
                <th>SDT</th>
                <th>Tên bác sĩ</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {appointments && appointments.length > 0
                ? appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{appointment.email}</td>
                      <td>{appointment.phone}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>
                         <select
                          className={
                          appointment.status === "Đang Chờ"
                          ? "value-pending"
                          : appointment.status === "Đã Chấp Nhận"
                          ? "value-accepted"
                          : "value-rejected"
                            }
                            value={appointment.status}
                           onChange={(e) =>
                             handleUpdateStatus(appointment._id, e.target.value)
                          }
                          >
                           <option value="Đang Chờ" className="value-pending">Đang Chờ</option> {/* Chỉnh sửa chữ "Chờ" in hoa */}
                           <option value="Đã Chấp Nhận" className="value-accepted">Đã Chấp Nhận</option>
                           <option value="Đã Từ Chối" className="value-rejected">Đã Từ Chối</option>
                           </select>
                      </td>
                    </tr>
                  ))
                : "No Appointments Found!"}
            </tbody>
          </table>
          {}
        </div>
      </section>
    </>
  );
};

export default Dashboard;