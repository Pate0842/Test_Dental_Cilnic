import GetAppointmentByIdStrategy from "./getAppointmentByIdStrategy.js";
import GetUserAppointmentStrategy from "./getUserAppointmentStrategy.js";
import PostAppointmentStrategy from "./postAppointmentStrategy.js";
import UpdateAppointmentStatusStrategy from "./updateAppointmentStatusStrategy.js";
import DeleteAppointmentStrategy from "./deleteAppointmentStrategy.js";
import GetAllAppointmentsStrategy from "./getAllAppointmentsStrategy.js";

//Simple Factory
class AppointmentStrategyFactory {
  static getStrategy(strategyName) {
    const strategies = {
      GetAppointmentById: GetAppointmentByIdStrategy,
      GetUserAppointment: GetUserAppointmentStrategy,
      PostAppointment: PostAppointmentStrategy,
      UpdateAppointmentStatus: UpdateAppointmentStatusStrategy,
      DeleteAppointment: DeleteAppointmentStrategy,
      GetAllAppointments: GetAllAppointmentsStrategy,
    };

    return strategies[strategyName] || null;
  }
}

export default AppointmentStrategyFactory;
