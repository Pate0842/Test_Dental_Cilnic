class Command {
    async execute() {
      throw new Error("execute() must be implemented");
    }
  
    async undo() {
      throw new Error("undo() must be implemented");
    }
  }
  
  export default Command;
  