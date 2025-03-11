class AppointmentContext {
    constructor(strategy) {
      this.strategy = strategy;
    }
  
    setStrategy(strategy) {
      this.strategy = strategy;
    }
  
    executeStrategy(req, res, next) {
      return this.strategy.execute(req, res, next);
    }
  }
  
  export default new AppointmentContext();
  