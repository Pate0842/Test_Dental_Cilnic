import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import {generateToken} from "../utils/jwtToken.js"
import sendEmail from "../utils/sendEmail.js";
import cloudinary from "cloudinary"
import jwt from "jsonwebtoken";
import PatientRegistration from "../core/PatientRegistration .js";
import { ConcreteDoctorManager } from "../core/ConcreteDoctorManager.js";
import { MongoCloudinaryDoctorImplementor } from "../core/MongoCloudinaryDoctorImplementor.js";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const patientRegistration = new PatientRegistration();
  await patientRegistration.register(req, res, next);
});

export const verifyEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) return next(new ErrorHandler("Token không hợp lệ hoặc người dùng không tồn tại!", 400));

    user.isVerified = true;
    await user.save();

    const redirectUrl = `${process.env.FRONTEND_URL}/verification-success`;
    res.redirect(redirectUrl);

  } catch (error) {
    return next(new ErrorHandler("Token không hợp lệ hoặc đã hết hạn!", 400));
  }
});

export const login = catchAsyncErrors(async(req,res,next) => {
  const {email, password, role} = req.body;
  if (!email || !password || !role) {
      return next(new ErrorHandler("Xin hãy cung cấp đầy đủ thông tin!", 400));
  }
  const user = await User.findOne({email}).select("+password");
  if (!user) {
      return next(new ErrorHandler("Email hoặc mật khẩu không chính xác!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
      return next(new ErrorHandler("Email hoặc mật khẩu không chính xác!", 400));
  }
  if (role !== "Admin" && role !== "Bác sĩ" && !user.isVerified) {
    return next(new ErrorHandler("Vui lòng xác thực email trước khi đăng nhập!", 400));
  }
  if (role !== user.role) {
      return next(new ErrorHandler("Không tìm thấy người dùng với vai trò này!", 400));
  }
  generateToken(user, "Đăng nhập thành công", 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phone, 
    password, 
    gender, 
    dob, 
    nic 
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password || 
    !gender ||
    !dob ||
    !nic 
  )  {
    return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(new ErrorHandler(`${isRegistered.role} với email này đã tồn tại!`));
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "Quản trị viên mới đã tạo thành công!"
  });
});

const implementor = new MongoCloudinaryDoctorImplementor();
const doctorManager = new ConcreteDoctorManager(implementor);

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!req.files || !req.files.docAvatar) {
      return next(new ErrorHandler("Avatar bác sĩ là bắt buộc!", 400));
    }

    const doctor = await doctorManager.addNewDoctor(req.body, req.files);
    res.status(200).json({
      success: true,
      message: "Bác sĩ mới đã tạo thành công!",
      doctor,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await doctorManager.getAllDoctors();
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getAllPatients = catchAsyncErrors(async (req, res, next) => {
  const patients = await User.find({ role: "Bệnh nhân" });
  res.status(200).json({
    success: true,
    patients,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Quản trị viên đăng xuất thành công.",
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Bệnh nhân đăng xuất thành công.",
    });
});

export const logoutDoctor = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("doctorToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Bác sĩ đăng xuất thành công.",
    });
});

export const deleteDoctors = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await doctorManager.deleteDoctor(id);
    res.status(200).json(result);
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
});

export const deletePatient = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id);

    if (!patient || patient.role !== "Bệnh nhân") {
      return next(new ErrorHandler("Không tìm thấy bệnh nhân!", 404));
    }

    await patient.deleteOne();
    res.status(200).json({
      success: true,
      message: "Đã xóa bệnh nhân!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa bệnh nhân:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi xóa bệnh nhân.", 500));
  }
});

export const updateDoctorHandler = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorManager.updateDoctor(id, req.body, req.files);
    res.status(200).json({
      success: true,
      message: "Cập nhật bác sĩ thành công!",
      doctor,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const updatePatientProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id; 
    const patient = await User.findById(userId);

    if (!patient || patient.role !== "Bệnh nhân") {
      return next(new ErrorHandler("Không tìm thấy bệnh nhân!", 404));
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      nic
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !gender || !dob || !nic) {
      return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }

    Object.assign(patient, { firstName, lastName, email, phone, gender, dob, nic });

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ bệnh nhân thành công!",
      patient,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật hồ sơ bệnh nhân:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi cập nhật hồ sơ bệnh nhân.", 500));
  }
});



export const updatePatientHandler = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await User.findById(id);

    if (!patient || patient.role !== "Bệnh nhân") {
      return next(new ErrorHandler("Không tìm thấy bệnh nhân", 404));
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      nic,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !gender || !dob || !nic) {
      return next(new ErrorHandler("Xin vui lòng điền đầy đủ thông tin!", 400));
    }

    Object.assign(patient, { firstName, lastName, email, phone, gender, dob, nic });


    await patient.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản bệnh nhân thành công!",
      updateUser: patient,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản bệnh nhân:", error);
    next(new ErrorHandler("Có lỗi xảy ra khi cập nhật tài khoản bệnh nhân.", 500));
  }
});