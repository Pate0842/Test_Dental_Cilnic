class AppointmentStrategy {
    execute(req, res, next) {
      throw new Error("Phương thức execute() phải được ghi đè trong lớp con.");
    }
  }
  
  export default AppointmentStrategy;
  