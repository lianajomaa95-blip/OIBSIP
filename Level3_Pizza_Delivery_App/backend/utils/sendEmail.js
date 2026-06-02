const nodemailer = require('nodemailer');
const sendEmail = async ({ to, subject, html }) => {
try {
const port = Number(process.env.EMAIL_PORT);
const transporter = nodemailer.createTransport({
host: process.env.EMAIL_HOST,
port,
secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
connectionTimeout: 5000, // fail fast (~5s) instead of hanging ~120s on a bad/blocked SMTP host
greetingTimeout: 5000,
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