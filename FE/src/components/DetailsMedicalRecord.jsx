import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailsMedicalRecord = () => {
  const { id } = useParams(); // Get the record ID from the route
  const [medicalRecord, setMedicalRecord] = useState(null);

  useEffect(() => {
    const fetchMedicalRecordDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/medicalrecord/get/${id}`, {
          withCredentials: true,
        });
        setMedicalRecord(res.data.record);
      } catch (err) {
        console.error("Error fetching medical record details:", err);
      }
    };

    fetchMedicalRecordDetails();
  }, [id]);

  if (!medicalRecord) {
    return <div>Loading...</div>;
  }

  return (
    <div className="medical-record-details">
      <h2>Chi Tiết Hồ Sơ Bệnh Án</h2>

      <table>
        <tbody>
          <tr>
            <th>Họ Tên Bệnh Nhân</th>
            <td>{`${medicalRecord.patient.firstName} ${medicalRecord.patient.lastName}`}</td>
          </tr>
          <tr>
            <th>Ngày Sinh</th>
            <td>{new Date(medicalRecord.patient.dob).toLocaleDateString('vi-VN')}</td>
          </tr>
          <tr>
            <th>Giới Tính</th>
            <td>{medicalRecord.patient.gender}</td>
          </tr>
          <tr>
            <th>Bác Sĩ</th>
            <td>{`${medicalRecord.doctor.firstName} ${medicalRecord.doctor.lastName}`}</td>
          </tr>
          <tr>
            <th>Khoa</th>
            <td>{medicalRecord.doctor.department}</td>
          </tr>
          <tr>
            <th>Chẩn Đoán</th>
            <td>{medicalRecord.diagnosis}</td>
          </tr>
          <tr>
            <th>Ngày Khám</th>
            <td>{new Date(medicalRecord.examinationDate).toLocaleDateString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            })}</td>
          </tr>
        </tbody>
      </table>

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
