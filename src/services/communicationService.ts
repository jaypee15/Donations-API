import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  // Configure your email service here
});

export const sendThankYouMessage = async (email: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'default@example.com',
    to: email,
    subject: 'Thank You for Your Donations',
    text: 'Thank you for making multiple donations! Your generosity is greatly appreciated.'
  };

  await transporter.sendMail(mailOptions);
};
