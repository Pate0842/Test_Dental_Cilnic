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
      res.status(400).json({ success: false, message: "Không có thao tác nào để hoàn tác!" });
    }
  }
}

export default new CommandInvoker();
