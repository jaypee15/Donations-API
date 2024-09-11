import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import SMTPTransport = require('nodemailer/lib/smtp-transport');


dotenv.config();

const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM } = process.env;
const transportOptions: SMTPTransport.Options = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { 
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD, 
    },
    tls: {
        rejectUnauthorized: true
    }
};

const transporter = nodemailer.createTransport(transportOptions);

export const sendThankYouMessage = async (email: string) => {
  const mailOptions = {
    from: EMAIL_FROM || 'default@example.com',
    to: email,
    subject: 'Thank You for Your Donations',
    text: 'Thank you for making multiple donations! Your generosity is greatly appreciated.'
  };

  await transporter.sendMail(mailOptions);
};
