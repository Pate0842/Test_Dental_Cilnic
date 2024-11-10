import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Context } from "../main";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MedicalRecordStatus = () => {
  const { user } = useContext(Context);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      fetchMedicalRecords(user._id);
    }
  }, [user]);

  const fetchMedicalRecords = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/medicalrecord/getuserrecords/${userId}`, {
        withCredentials: true,
      });
      const sortedRecords = res.data.medicalRecords.sort((a, b) => 
        new Date(b.examinationDate) - new Date(a.examinationDate)
      );
      setMedicalRecords(sortedRecords);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đã có lỗi xảy ra!");
    }
  };

  // Chuyển hướng tới trang chi tiết hồ sơ bệnh án với ID cụ thể
  const handleIdClick = (recordId) => {
    navigate(`/details-medical-record/${recordId}`);
  };

  return (
    <div className="page-content">
      <section className="MedicalRecordStatus page">
        <div className="MedicalRecord-bannerstatus">
          <h5>Trạng Thái Hồ Sơ Bệnh Án</h5>
          <table>
            <thead>
              <tr>
                <th>ID Bệnh Án</th>
                <th>Ngày Khám</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>Không có hồ sơ bệnh án nào.</td>
                </tr>
              ) : (
                medicalRecords.map((record) => (
                  <tr key={record._id} onClick={() => handleIdClick(record._id)}>
                    <td style={{ cursor: "pointer", color: "blue" }}>{record._id}</td>
                    <td>{new Date(record.examinationDate).toLocaleDateString()}</td>
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

export default MedicalRecordStatus;
