import AppointmentContext from "../strategies/appointment/appointmentContext.js";
import PostAppointmentStrategy from "../strategies/appointment/postAppointmentStrategy.js";
import GetAllAppointmentsStrategy from "../strategies/appointment/getAllAppointmentsStrategy.js";
import GetAppointmentByIdStrategy from "../strategies/appointment/getAppointmentByIdStrategy.js";
import UpdateAppointmentStatusStrategy from "../strategies/appointment/updateAppointmentStatusStrategy.js";
import DeleteAppointmentStrategy from "../strategies/appointment/deleteAppointmentStrategy.js";
import GetUserAppointmentStrategy from "../strategies/appointment/getUserAppointmentStrategy.js"; // ✅ Import chiến lược mới

export const postAppointment = (req, res, next) => {
  AppointmentContext.setStrategy(PostAppointmentStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const getAllAppointments = (req, res, next) => {
  AppointmentContext.setStrategy(GetAllAppointmentsStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const getAppointmentById = (req, res, next) => {
  AppointmentContext.setStrategy(GetAppointmentByIdStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const updateAppointmentStatus = (req, res, next) => {
  AppointmentContext.setStrategy(UpdateAppointmentStatusStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const deleteAppointment = (req, res, next) => {
  AppointmentContext.setStrategy(DeleteAppointmentStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};

// ✅ Thêm phương thức mới
export const getUserAppointments = (req, res, next) => {
  AppointmentContext.setStrategy(GetUserAppointmentStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};
