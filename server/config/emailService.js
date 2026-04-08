import http from "http";
import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
    auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASSWORD, // Your email password or app password
  },
});

// Function to send an email

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL, // Sender address
            to, // List of recipients
            subject, // Subject line
            html, // HTML body
        });
         return {success: true, messageId: info.messageId};
    } catch (error) {
        console.error("Error sending email:", error);
        return {success: false, error: error.message};

    }
};
