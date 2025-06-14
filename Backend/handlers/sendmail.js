const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587, 
  secure: false, //(use secure: true for port 465)
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // TEMPORARY for dev (remove in prod)
  }
});

const sendMail = async (receiverEmail, senderName, doctorName, date) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: receiverEmail,
      subject: "Session Confirmation – Detoxify Recovery Support",
      text: `Hi ${senderName},

This is to confirm that you’ve successfully scheduled a recovery support session with ${doctorName} on ${date}.

We're proud of you for taking this step toward healing. Remember — you're not alone in this journey.

If you have any questions or need to reschedule, feel free to reply to this email.

Stay strong,  
Team Detoxify`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2e86de;">Session Confirmed ✅</h2>
          <p>Hi <strong>${senderName}</strong>,</p>
          <p>Thank you for choosing to take a step toward healing.</p>
          <p>Your session with <strong>${doctorName}</strong> has been confirmed for <strong>${date}</strong>.</p>
          <p>We're proud of you for reaching out. Remember, you're never alone in this journey.</p>
          <p>If you have any questions or wish to reschedule, simply reply to this email or reach us via the Detoxify platform.</p>
          <br>
          <p style="color: #555;">Stay strong,<br><strong>Team Detoxify</strong></p>
        </div>
      `,
    });

    console.log("✅ Message sent: %s", info.messageId);
  } catch (err) {
    console.error("❌ Error while sending mail:", err.message);
  }
};

module.exports=sendMail;