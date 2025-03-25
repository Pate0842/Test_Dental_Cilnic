import app from "./app.js";
import express from "express";
import cloudinary from "cloudinary"
import messageRouter from "./router/messageRouter.js";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Sử dụng API messages sử dụng prototype pattern
app.use("/api/v1/message", messageRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
  });