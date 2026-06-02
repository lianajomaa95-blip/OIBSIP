const { Resend } = require('resend');

// Resend uses an HTTPS API (port 443) instead of SMTP, so it works on hosts
// like Render's free tier that block outbound SMTP ports (25/465/587).
// Instantiate lazily so a missing API key doesn't crash the server at startup.
let resend;

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set');
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  // Must be a verified domain in Resend, or "onboarding@resend.dev" for testing
  // (the test sender can only deliver to the Resend account owner's email).
  const from = process.env.EMAIL_FROM || 'Pizza Delivery <onboarding@resend.dev>';

  const { data, error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    console.error('Email send error:', error.message || error);
    throw new Error('Failed to send email');
  }

  console.log('Email sent successfully to', to, '- ID:', data?.id);
  return { success: true, id: data?.id };
};

module.exports = sendEmail;
