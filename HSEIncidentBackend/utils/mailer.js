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
      <p>📝 <b>Description:</b> ${incident.description}</p>
      <p>🧑‍💼 <b>Reported By:</b> ${replyTo}</p>
      <p>👥 <b>Reported To:</b> ${incident.reportingPersons?.join(', ') || 'N/A'}</p>
      ${
        incident.imageBase64
          ? `<p>📸 <b>Incident image is attached below.</b></p>`
          : '<p><i>No image submitted</i></p>'
      }
    `,
    attachments: incident.imageBase64
      ? [
          {
            filename: 'incident.jpg',
            content: incident.imageBase64,
            encoding: 'base64',
            contentType: 'image/jpeg',
          },
        ]
      : [],
  });

  console.log('✅ Incident email sent to:', toEmails);
};

/* ───────────── Confirmation to reporter ───────────── */

const sendReporterConfirmation = async ({ to, incident }) => {
  await transporter.sendMail({
    from: `"HSE Incident App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Incident registered successfully',
    html: `
      <p>Hi,</p>
      <p>Your incident was submitted and forwarded to: 
         <b>${incident.reportingPersons?.join(', ') || 'N/A'}</b>.</p>

      <h3>Incident Details</h3>
      <p>📍 <b>Area:</b> ${incident.incidentArea}</p>
      <p>📂 <b>Category:</b> ${incident.category}</p>
      <p>📝 <b>Description:</b> ${incident.description}</p>
      <p>👥 <b>Reported To:</b> ${incident.reportingPersons?.join(', ') || 'N/A'}</p>

      ${
        incident.imageBase64
          ? '<p>📸 <b>Incident image attached:</b><br><img src="cid:incidentImage" width="300"/></p>'
          : '<p><i>No image submitted</i></p>'
      }
    `,
    attachments: incident.imageBase64
      ? [
          {
            filename: 'incident.jpg',
            content: incident.imageBase64,
            encoding: 'base64',
            contentType: 'image/jpeg',
            cid: 'incidentImage',   // ★ referenced above
          },
        ]
      : [],
  });

  console.log('✅ Confirmation email sent to reporter:', to);
};


/* -------- Export all helpers -------- */
module.exports = {
  sendMail,
  sendIncidentEmail,
  sendReporterConfirmation,
};
