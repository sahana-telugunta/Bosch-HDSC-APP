const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App password
  },
});

const sendIncidentEmail = async ({ to, subject, incident }) => {
  try {
    const toEmails = Array.isArray(to) ? to : [];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmails.join(','),
      subject,
      html: `
        <h3>New incident has been reported:</h3>
        <p>📍 <b>Area:</b> ${incident.incidentArea}</p>
        <p>📂 <b>Category:</b> ${incident.category}</p>
        <p>📝 <b>Comment:</b> ${incident.comment}</p>
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
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', toEmails);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

module.exports = sendIncidentEmail;
