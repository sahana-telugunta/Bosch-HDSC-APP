// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ───────────── Generic helper (no attachment) ───────────── */
const sendMail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: `"HSE Incident App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
  console.log('✅ Email sent to:', to);
};

/* ───────────── Incident‑specific helper ───────────── */
const sendIncidentEmail = async ({ to, subject, incident, replyTo }) => {
  const toEmails = Array.isArray(to) ? to : [];

  await transporter.sendMail({
    from: `"HSE Incident App" <${process.env.EMAIL_USER}>`,
    to: toEmails.join(','),
    replyTo,
    subject,
    html: `
      <h3>New incident has been reported:</h3>
      <p>📍 <b>Area:</b> ${incident.incidentArea}</p>
      <p>📂 <b>Category:</b> ${incident.category}</p>
      <p>📝 <b>Comment:</b> ${incident.comment}</p>
      <p>🧑‍💼 <b>Reported By:</b> ${replyTo}</p>
      <p>👥 <b>Reported To:</b> ${incident.reportingPersons?.join(', ') || 'N/A'}</p>
      ${
        incident.imageBase64
          ? `<img src="cid:incidentImg" width="300"/>`
          : '<i>No image submitted</i>'
      }
    `,
    attachments: incident.imageBase64
      ? [
          {
            filename: 'incident.jpg',
            content: Buffer.from(incident.imageBase64, 'base64'),
            cid: 'incidentImg',
          },
        ]
      : [],
  });

  console.log('✅ Incident email sent to:', toEmails);
};

/* -------- Export both helpers -------- */
module.exports = { sendMail, sendIncidentEmail };
