import mongoose from "mongoose";

const uri = "mongodb+srv://Nhanle:Nhanle@cluster0.azpe8.mongodb.net/MERN_HOSPITAL_MANAGEMENT_SYSTEM?retryWrites=true&w=majority";

mongoose
  .connect(uri)
  .then(() => console.log("✅ Kết nối thành công với MongoDB!"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));
