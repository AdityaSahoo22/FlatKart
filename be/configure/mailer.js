import nodemailer from "nodemailer";

const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendOTPEmail = async (to, otp) => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"FlatRental" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Reset OTP",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #eee;border-radius:10px">
        <h2 style="color:#2c3e50">🔒 Password Reset OTP</h2>
        <p>You requested to reset your password. Use the OTP below:</p>
        <div style="font-size:2.5rem;font-weight:bold;letter-spacing:12px;color:#2c3e50;text-align:center;padding:20px;background:#f0f2f5;border-radius:8px;margin:20px 0">
          ${otp}
        </div>
        <p style="color:#888;font-size:0.9rem">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="color:#888;font-size:0.9rem">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};
