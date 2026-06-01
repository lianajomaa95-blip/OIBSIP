const nodemailer = require('nodemailer');
const sendEmail = async ({ to, subject, html }) => {
try {
const transporter = nodemailer.createTransport({
host: process.env.EMAIL_HOST,
port: process.env.EMAIL_PORT,
secure: false,
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
});
const info = await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to,
  subject,
  html,
});

console.log('Email sent successfully to', to, '- Message ID:', info.messageId);
return { success: true, messageId: info.messageId };
} catch (error) {
console.error('Email send error:', error.message);
throw new Error('Failed to send email');
}
};
module.exports = sendEmail;