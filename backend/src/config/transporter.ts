import nodemailer from "nodemailer";

console.log("Email đang dùng:", process.env.MY_EMAIL);
console.log("Password đang dùng:", process.env.MY_EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD,
  },
});

export default transporter;
