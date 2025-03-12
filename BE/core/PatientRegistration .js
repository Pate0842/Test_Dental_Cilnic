import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import BaseRegistration from "./BaseRegistration .js";

class PatientRegistration extends BaseRegistration {
  validateData(data) {
    const { firstName, lastName, email, phone, password, confirmPassword, gender, dob, nic, role } = data;
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !gender || !dob || !nic || !role) {
      throw new ErrorHandler("Vui lòng điền đầy đủ thông tin!", 400);
    }
    if (password !== confirmPassword) {
      throw new ErrorHandler("Mật khẩu không trùng khớp!", 400);
    }
  }

  async checkExistingUser(data) {
    const { email, nic } = data;
    let user = await User.findOne({ email });
    if (user) throw new ErrorHandler("Email đã được đăng ký!", 400);

    user = await User.findOne({ nic });
    if (user) throw new ErrorHandler("CCCD đã tồn tại!", 400);
  }

  async createUser(data) {
    const { firstName, lastName, email, phone, password, gender, dob, nic } = data;
    return await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      nic,
      role: "Bệnh nhân",
      isVerified: false,
    });
  }

  async sendVerificationEmail(user) {
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    const verificationUrl = `${process.env.BACKEND_URL}/api/v1/user/verify/${verificationToken}`;

    const message = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Welcome to Happy Teeth!</h2>
        <p>Dear ${user.firstName},</p>
        <p>Thank you for registering with us. Please verify your email by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #4CAF50; color: #ffffff; text-decoration: none; border-radius: 5px;">
          Verify Your Email
        </a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The Happy Teeth Team</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Email Verification - Happy Teeth",
      html: message,
    });
  }

  sendResponse(user, res) {
    res.status(200).json({
      success: true,
      message: "Người dùng đã đăng kí thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        nic: user.nic,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
        isVerified: user.isVerified,
        _id: user._id,
      },
      token: user.generateJsonWebToken(),
    });
  }
}
export default PatientRegistration;