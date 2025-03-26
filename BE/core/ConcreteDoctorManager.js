import { DoctorManager } from "./DoctorManager.js";

export class ConcreteDoctorManager extends DoctorManager {
  async addNewDoctor(data, files) {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      doctorDepartment,
    } = data;

    // Kiểm tra dữ liệu đầu vào
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !gender ||
      !dob ||
      !nic ||
      !doctorDepartment ||
      !files?.docAvatar
    ) {
      throw new Error("Xin vui lòng điền đầy đủ thông tin!");
    }

    // Kiểm tra email đã tồn tại chưa
    const isRegistered = await this.implementor.findUserByEmail(email);
    if (isRegistered) {
      throw new Error(`${isRegistered.role} với email này đã tồn tại!`);
    }

    // Upload avatar
    const avatarData = await this.implementor.uploadAvatar(files.docAvatar);

    // Chuẩn bị dữ liệu bác sĩ
    const doctorData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      role: "Bác sĩ",
      doctorDepartment,
      docAvatar: avatarData,
    };

    return await this.implementor.saveDoctor(doctorData);
  }

  async getAllDoctors() {
    return await this.implementor.findDoctors();
  }

  async deleteDoctor(id) {
    const doctor = await this.implementor.findDoctorById(id);
    if (!doctor) {
      throw new Error("Không tìm thấy bác sĩ!");
    }
    await this.implementor.deleteDoctor(id);
    return { success: true, message: "Đã xóa bác sĩ!" };
  }

  async updateDoctor(id, data, files) {
    const doctor = await this.implementor.findDoctorById(id);
    if (!doctor) {
      throw new Error("Không tìm thấy bác sĩ!");
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      nic,
      doctorDepartment,
    } = data;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !gender ||
      !dob ||
      !nic ||
      !doctorDepartment
    ) {
      throw new Error("Xin vui lòng điền đầy đủ thông tin!");
    }

    // Cập nhật dữ liệu
    const updatedData = {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      nic,
      doctorDepartment,
    };

    // Nếu có avatar mới, upload và cập nhật
    if (files?.docAvatar) {
      const avatarData = await this.implementor.uploadAvatar(files.docAvatar);
      updatedData.docAvatar = avatarData;
    }

    return await this.implementor.updateDoctor(id, updatedData);
  }
}
