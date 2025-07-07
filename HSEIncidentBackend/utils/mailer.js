const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // your app email
    pass: process.env.EMAIL_PASS        // app password
  }
});

const sendIncidentEmail = async ({ to, subject, incident, replyTo }) => {
  try {
    const toEmails = Array.isArray(to) ? to : [];

    const mailOptions = {
      from: `"HSE Incident App" <${process.env.EMAIL_USER}>`,
      to: toEmails.join(','),
      replyTo,
      subject,
      html: `
        <h3>New incident has been reported:</h3>
        <p>📍 <b>Area:</b> ${incident.incidentArea}</p>
        <p>📂 <b>Category:</b> ${incident.category}</p>
        <p>📝 <b>Comment:</b> ${incident.comment}</p>
        <p>👥 <b>Reported To:</b> ${incident.reportingPersons?.join(', ') || 'N/A'}</p>
        <p>🧑‍💼 <b>Reported By:</b> ${replyTo}</p>
        ${
          incident.imageBase64
            ? `<p><b>Image:</b><br/><img src="cid:incidentImg" width="300"/></p>`
            : '<p><i>No image submitted</i></p>'
        }
      `,
      attachments: incident.imageBase64
        ? [
            {
              filename: 'incident.jpg',
              content: Buffer.from(incident.imageBase64, 'base64'),
              cid: 'incidentImg'
            }
          ]
        : []
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', toEmails);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

module.exports = { sendIncidentEmail };
