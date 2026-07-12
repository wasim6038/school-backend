import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Sends a transactional email. Failures are logged but never thrown up to
 * the request cycle so a flaky SMTP provider can't 500 an otherwise
 * successful form submission.
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'School Website'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text
    });
    return true;
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    return false;
  }
};

export const contactFormTemplate = ({ name, email, phone, subject, message }) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
    <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  </div>
`;

export const admissionStatusTemplate = ({ studentName, applicationNumber, status }) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2>Admission Application Update</h2>
    <p>Dear Parent/Guardian,</p>
    <p>The admission application <strong>${applicationNumber}</strong> for
    <strong>${studentName}</strong> has been updated to status:
    <strong>${status.toUpperCase()}</strong>.</p>
    <p>You can track the status any time using your application number on our website.</p>
  </div>
`;
