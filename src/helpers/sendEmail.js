const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (message) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    ...message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
