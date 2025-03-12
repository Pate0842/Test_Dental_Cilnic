class BaseRegistration {
  async register(req, res, next) {
    try {
      // Bước 1: Kiểm tra dữ liệu đầu vào
      this.validateData(req.body);

      // Bước 2: Kiểm tra xem người dùng đã tồn tại chưa
      await this.checkExistingUser(req.body);

      // Bước 3: Tạo người dùng mới
      const user = await this.createUser(req.body);

      // Bước 4: Gửi email xác thực
      await this.sendVerificationEmail(user);

      // Bước 5: Phản hồi về client
      this.sendResponse(user, res);
      
    } catch (error) {
      next(error);
    }
  }

  validateData(data) {
    throw new Error("validateData must be implemented in subclasses");
  }

  async checkExistingUser(data) {
    throw new Error("checkExistingUser must be implemented in subclasses");
  }

  async createUser(data) {
    throw new Error("createUser must be implemented in subclasses");
  }

  async sendVerificationEmail(user) {
    throw new Error("sendVerificationEmail must be implemented in subclasses");
  }

  sendResponse(user, res) {
    throw new Error("sendResponse must be implemented in subclasses");
  }
}
export default BaseRegistration;