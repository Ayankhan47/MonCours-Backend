import transporter from "../config/email.js";

const sendEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: message,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email sending failed:", error.message);
    throw error;
  }
};

export default sendEmail;