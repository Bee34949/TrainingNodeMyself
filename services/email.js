const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const url = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"MyApp" <${process.env.SMTP_USER}>`,
    to,
    subject: 'ยืนยัน Email ของคุณ',
    html: `
      <h2>ยินดีต้อนรับ!</h2>
      <p>กรุณากดลิงก์ด้านล่างเพื่อยืนยัน email ของคุณ</p>
      <a href="${url}" style="padding:10px 20px;background:#4F46E5;color:white;border-radius:5px;text-decoration:none;">
        ยืนยัน Email
      </a>
      <p>ลิงก์นี้จะหมดอายุใน 24 ชั่วโมง</p>
    `,
  });
};

const sendResetPasswordEmail = async (to, token) => {
  const url = `${process.env.APP_URL}/api/auth/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"MyApp" <${process.env.SMTP_USER}>`,
    to,
    subject: 'รีเซ็ตรหัสผ่าน',
    html: `
      <h2>รีเซ็ตรหัสผ่าน</h2>
      <p>กรุณากดลิงก์ด้านล่างเพื่อตั้งรหัสผ่านใหม่</p>
      <a href="${url}" style="padding:10px 20px;background:#EF4444;color:white;border-radius:5px;text-decoration:none;">
        รีเซ็ตรหัสผ่าน
      </a>
      <p>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
      <p>หากคุณไม่ได้ขอรีเซ็ต กรุณาเพิกเฉยต่ออีเมลนี้</p>
    `,
  });
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
