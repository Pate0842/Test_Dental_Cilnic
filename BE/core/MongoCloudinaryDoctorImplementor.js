import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { DoctorImplementor } from "./DoctorImplementor.js";

export class MongoCloudinaryDoctorImplementor extends DoctorImplementor {
  async saveDoctor(data) {
    const doctor = await User.create(data);
    return doctor;
  }

  async findDoctors() {
    return await User.find({ role: "Bác sĩ" });
  }

  async findDoctorById(id) {
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "Bác sĩ") return null;
    return doctor;
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async deleteDoctor(id) {
    await User.findByIdAndDelete(id);
  }

  async updateDoctor(id, data) {
    const doctor = await User.findByIdAndUpdate(id, data, { new: true });
    return doctor;
  }

  async uploadAvatar(file) {
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(file.mimetype)) {
      throw new Error("Định dạng tệp không được hỗ trợ!");
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(file.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      throw new Error("Lỗi khi tải ảnh lên Cloudinary!");
    }

    return {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
}