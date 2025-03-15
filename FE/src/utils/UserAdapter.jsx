// utils/UserAdapter.jsx
class UserAdapter {
    constructor(rawUserData) {
      this.data = rawUserData || {};
    }
  
    getFormattedUser() {
      const formattedUser = {
        // Giữ nguyên các trường gốc từ API
        ...this.data, // Bao gồm first_name, last_name, email, phone, nic, dob, gender, _id, v.v.
        
        // Thêm các trường chuẩn hóa để giao diện sử dụng
        firstName: this.data.first_name || this.data.firstName || "Unknown",
        lastName: this.data.last_name || this.data.lastName || "User",
        fullName: this._getFullName(),
      };
  
      // Nếu API trả về trường "name", tách thành firstName và lastName
      if (this.data.name) {
        const [firstName, ...lastNameParts] = this.data.name.split(" ");
        formattedUser.firstName = firstName || "Unknown";
        formattedUser.lastName = lastNameParts.join(" ") || "User";
        formattedUser.fullName = this.data.name;
      }
  
      return formattedUser;
    }
  
    // Phương thức chuyển đổi ngược về định dạng API (không cần dùng trong trường hợp này)
    toApiFormat(formattedUser) {
      return {
        first_name: formattedUser.firstName,
        last_name: formattedUser.lastName,
        email: formattedUser.email,
        phone: formattedUser.phone,
        nic: formattedUser.nic,
        dob: formattedUser.dob,
        gender: formattedUser.gender,
      };
    }
  
    _getFullName() {
      const firstName = this.data.first_name || this.data.firstName || "Unknown";
      const lastName = this.data.last_name || this.data.lastName || "User";
      return `${firstName} ${lastName}`.trim();
    }
  }
  
  export default UserAdapter;