import AppointmentContext from "../strategies/appointment/appointmentContext.js";
import PostAppointmentStrategy from "../strategies/appointment/postAppointmentStrategy.js";
import GetAllAppointmentsStrategy from "../strategies/appointment/getAllAppointmentsStrategy.js";
import GetAppointmentByIdStrategy from "../strategies/appointment/getAppointmentByIdStrategy.js";
import DeleteAppointmentStrategy from "../strategies/appointment/deleteAppointmentStrategy.js";
import GetUserAppointmentStrategy from "../strategies/appointment/getUserAppointmentStrategy.js";
import UpdateAppointmentStatusCommand from "../service/UpdateAppointmentStatusCommand.js";
import CommandInvoker from "../service/CommandInvoker.js";

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

export const updateAppointmentStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  // Tạo một Command để cập nhật trạng thái lịch hẹn
  const command = new UpdateAppointmentStatusCommand(id, status);

  // Thực thi command qua CommandInvoker
  await CommandInvoker.executeCommand(command, req, res, next);
};

export const undoUpdateAppointmentStatus = async (req, res, next) => {
  await CommandInvoker.undoLastCommand(req, res, next);
};

export const deleteAppointment = (req, res, next) => {
  AppointmentContext.setStrategy(DeleteAppointmentStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};

export const getUserAppointments = (req, res, next) => {
  AppointmentContext.setStrategy(GetUserAppointmentStrategy);
  AppointmentContext.executeStrategy(req, res, next);
};