import AppointmentStrategyFactory from "../strategies/appointment/appointmentStrategyFactory.js";
import AppointmentContext from "../strategies/appointment/appointmentContext.js";
import PostAppointmentStrategy from "../strategies/appointment/postAppointmentStrategy.js";
import GetAllAppointmentsStrategy from "../strategies/appointment/getAllAppointmentsStrategy.js";
import GetAppointmentByIdStrategy from "../strategies/appointment/getAppointmentByIdStrategy.js";
import DeleteAppointmentStrategy from "../strategies/appointment/deleteAppointmentStrategy.js";
import GetUserAppointmentStrategy from "../strategies/appointment/getUserAppointmentStrategy.js";
import UpdateAppointmentStatusCommand from "../service/UpdateAppointmentStatusCommand.js";
import CommandInvoker from "../service/CommandInvoker.js";

export const postAppointment = (req, res, next) => {
  try {
    console.log("📌 [postAppointment] Bắt đầu xử lý...");
    console.log("📩 Dữ liệu nhận được:", req.body);

    const strategy = AppointmentStrategyFactory.getStrategy("PostAppointment");
    AppointmentContext.setStrategy(strategy);
    AppointmentContext.executeStrategy(req, res, next);
  } catch (error) {
    console.error("❌ Lỗi xảy ra trong postAppointment:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const getAllAppointments = (req, res, next) => {
  const strategy = AppointmentStrategyFactory.getStrategy("GetAllAppointments");
  AppointmentContext.setStrategy(strategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const getAppointmentById = (req, res, next) => {
  const strategy = AppointmentStrategyFactory.getStrategy("GetAppointmentById");
  AppointmentContext.setStrategy(strategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const updateAppointmentStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const command = new UpdateAppointmentStatusCommand(id, status);
  await CommandInvoker.executeCommand(command, req, res, next);
};

export const undoUpdateAppointmentStatus = async (req, res, next) => {
  await CommandInvoker.undoLastCommand(req, res, next);
};

export const deleteAppointment = (req, res, next) => {
  const strategy = AppointmentStrategyFactory.getStrategy("DeleteAppointment");
  AppointmentContext.setStrategy(strategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const getUserAppointments = (req, res, next) => {
  const strategy = AppointmentStrategyFactory.getStrategy("GetUserAppointment");
  AppointmentContext.setStrategy(strategy);
  AppointmentContext.executeStrategy(req, res, next);
};