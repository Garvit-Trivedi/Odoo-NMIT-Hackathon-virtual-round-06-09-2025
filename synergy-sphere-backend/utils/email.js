import nodemailer from 'nodemailer';

const createTransport = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return null;
};

export const sendResetEmail = async (to, link) => {
  const transporter = createTransport();
  const subject = 'SynergySphere password reset';
  const html = `<p>Click the link to reset your password (valid 1 hour):</p><p><a href="${link}">${link}</a></p>`;

  if (!transporter) {
    console.log('DEV RESET LINK:', link);
    return;
  }

  await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
};