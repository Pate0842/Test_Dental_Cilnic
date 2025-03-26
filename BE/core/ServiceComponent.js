export class ServiceComponent {
    getCost() {
      throw new Error("Phương thức getCost phải được triển khai!");
    }
  
    getDetails() {
      throw new Error("Phương thức getDetails phải được triển khai!");
    }
  
    add(component) {
      throw new Error("Phương thức add không được hỗ trợ!");
    }
  
    remove(component) {
      throw new Error("Phương thức remove không được hỗ trợ!");
    }
  }