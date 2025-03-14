class CommandInvoker {
  constructor() {
    this.commandHistory = [];
  }

  async executeCommand(command, req, res, next) {
    await command.execute(req, res, next);
    this.commandHistory.push(command);
  }

  async undoLastCommand(req, res, next) {
    const lastCommand = this.commandHistory.pop();
    if (lastCommand) {
      await lastCommand.undo(req, res, next);
    } else {
      next(new Error('No command to undo', 400));
    }
  }
}

export default new CommandInvoker();