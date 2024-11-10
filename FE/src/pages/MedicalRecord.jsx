import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MedicalRecordStatus = () => {
  const { user } = useContext(Context);
  const [medicalRecords, setMedicalRecords] = useState([]); 
  const [appointments, setAppointments] = useState([]); // Lưu danh sách các cuộc hẹn
  const navigate = useNavigate();

  // Lấy danh sách cuộc hẹn của người dùng
  useEffect(() => {
    if (user && user._id) {
      fetchUserAppointments(user._id);  // Truy vấn cuộc hẹn dựa trên userId
    }
  }, [user]);

  // Lấy thông tin hồ sơ bệnh án từ appointmentId
  useEffect(() => {
    if (appointments.length > 0) {
      fetchMedicalRecords(appointments[0]._id);  // Dùng appointmentId từ cuộc hẹn đầu tiên
    }
  }, [appointments]);

  const fetchUserAppointments = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/appointment/getuserappointments`, {
        params: { userId }, // Truyền userId trong query parameters
        withCredentials: true,
      });

      if (res.data.success) {
        setAppointments(res.data.appointments);
      } else {
        toast.error("Không có cuộc hẹn nào!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Đã có lỗi xảy ra khi tải lịch hẹn!");
    }
  };

  const fetchMedicalRecords = async (appointmentId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/medicalrecord/getuserrecords/${appointmentId}`, {
        withCredentials: true,
      });

      const sortedRecords = res.data.medicalRecords.sort((a, b) =>
        new Date(b.examinationDate) - new Date(a.examinationDate)
      );
      setMedicalRecords(sortedRecords);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể tải hồ sơ bệnh án!");
    }
  };

  const handleIdClick = (recordId) => {
    navigate(`/details-medical-record/${recordId}`);
  };

  return (
    <div className="page-content">
      <section className="MedicalRecordStatus page">
        <div className="MedicalRecord-bannerstatus">
          <h5>Trạng Thái Hồ Sơ Bệnh Án</h5>
          {medicalRecords.length === 0 ? (
            <div className="text-center p-4">Không có hồ sơ bệnh án nào.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2 border">ID Hồ Sơ Bệnh Án</th>
                  <th className="p-2 border">Ngày Khám</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map((record) => (
                  <tr
                    key={record._id}
                    onClick={() => handleIdClick(record._id)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-2 border text-blue-600">{record._id}</td>
                    <td className="p-2 border">
                      {new Date(record.examinationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default MedicalRecordStatus;
