export class DoctorManager {
    constructor(implementor) {
      this.implementor = implementor;
    }
  
    async addNewDoctor(data, files) {
      throw new Error("Phương thức này phải được triển khai trong lớp con!");
    }
  
    async getAllDoctors() {
      throw new Error("Phương thức này phải được triển khai trong lớp con!");
    }
  
    async deleteDoctor(id) {
      throw new Error("Phương thức này phải được triển khai trong lớp con!");
    }
  
    async updateDoctor(id, data, files) {
      throw new Error("Phương thức này phải được triển khai trong lớp con!");
    }
  }