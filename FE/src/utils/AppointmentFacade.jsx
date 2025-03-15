// utils/AppointmentFacade.jsx
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentFacade = {
  // Facade Pattern: Đơn giản hóa việc lấy danh sách bác sĩ (ẩn chi tiết gọi API và xử lý lỗi)
  fetchDoctors: async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/user/doctors", {
        withCredentials: true,
      });
      return data.doctors;
    } catch {
      toast.error("Không thể tải danh sách bác sĩ.");
      return [];
    }
  },

  // Facade Pattern: Đơn giản hóa việc lấy danh sách lịch hẹn (ẩn chi tiết gọi API, xử lý lỗi, và sắp xếp dữ liệu)
  fetchUserAppointments: async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/appointment/getuserappointments", {
        withCredentials: true,
      });
      // Sắp xếp theo ngày giảm dần
      return data.appointments.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
    } catch {
      toast.error("Không thể tải lịch hẹn.");
      return [];
    }
  },

  // Facade Pattern: Đơn giản hóa việc tạo lịch hẹn (ẩn chi tiết gọi API, xử lý dữ liệu và lỗi)
  createAppointment: async (appointmentData) => {
    try {
      const hasVisitedBool = Boolean(appointmentData.hasVisited);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          ...appointmentData,
          hasVisited: hasVisitedBool,
          appointment_date: appointmentData.appointmentDate,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      return true;
    } catch {
      toast.error("Đặt lịch hẹn thất bại.");
      return false;
    }
  },

  // Facade Pattern: Đơn giản hóa việc validate ngày (ẩn logic kiểm tra ngày phức tạp)
  validateDate: (selectedDate, isDob = false) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(selectedDate);

    if (isDob && dateToCheck > today) {
      toast.error("Ngày sinh không thể lớn hơn ngày hiện tại. Tự động đặt thành ngày hôm nay.");
      return today.toISOString().split("T")[0];
    } else if (!isDob && dateToCheck < today) {
      toast.error("Ngày hẹn phải lớn hơn ngày hôm nay.");
      return "";
    }
    return selectedDate;
  },
};

export default AppointmentFacade;