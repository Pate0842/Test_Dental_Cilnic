import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [2, "Tên phải chứa ít nhất 2 ký tự!"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [2, "Họ phải chứa ít nhất 2 ký tự!"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Hãy cung cấp một địa chỉ email hợp lệ!"],
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Kiểm tra độ dài phải là 10 số
        if (value.length !== 10) {
          return false;
        }
        // Kiểm tra đầu số hợp lệ
        const prefix = value.substring(0, 3);
        return validPrefixes.includes(prefix);
      },
      message: "Số điện thoại không hợp lệ!",
    },
  },
  nic: {
    type: String,
    required: [true, "Số Căn cước công dân là bắt buộc!"],
    minLength: [12, "Số Căn cước công dân phải chứa đúng 12 chữ số!"],
    maxLength: [12, "Số Căn cước công dân phải chứa đúng 12 chữ số!"],
  },
  dob: {
    type: Date,
    required: [true, "Ngày sinh là bắt buộc!"],
    validate: {
      validator: function (value) {
        return value <= new Date();
      },
      message: "Ngày sinh không hợp lệ!",
    },
  },
  gender: {
    type: String,
    required: [true, "Giới tính là bắt buộc!"],
    enum: ["Nam", "Nữ"],
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc!"],
    minLength: [8, "Mật khẩu phải chứa ít nhất 8 ký tự!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Vai trò người dùng là bắt buộc!"],
    enum: ["Bệnh nhân", "Bác sĩ", "Admin"],
  },
  doctorDepartment:{
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const validPrefixes = [
  "032", "033", "034", "035", "036", "037", "038", "039", // Viettel
  "096", "097", "098", "086", // Viettel
  "083", "084", "085", "081", "082", "088", // Vinaphone
  "091", "094", // Vinaphone
  "070", "079", "077", "076", "078", // Mobifone
  "090", "093", // Mobifone
  "089", // Mobifone
  "056", "058", // Vietnamobile
  "092", // Vietnamobile
  "059", // Gmobile
  "099" // Gmobile
];

// Middleware để tự động đặt ngày sinh nếu nó lớn hơn ngày hôm nay
userSchema.pre("save", function (next) {
  if (this.dob > new Date()) {
    this.dob = new Date(); // Đặt giá trị ngày sinh bằng ngày hôm nay
  }

  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;
    next();
  }).catch(next);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);