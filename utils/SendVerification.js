import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Verification_Email_Template } from '../libs/VerificationTemplate.js';
dotenv.config();

const { AUTH_EMAIL, MAIL_PASSWORD, MAIL_HOST } = process.env;

let transporter = nodemailer.createTransport({
  service: 'gmail',
  tls: { rejectUnauthorized: false },
  host: MAIL_HOST,
  auth: {
    user: AUTH_EMAIL,
    pass: MAIL_PASSWORD // Corrected key
  }
});

export const sendVerificationEmail = async (email, verification, res) => {
  // Email option
  try {
    await transporter.sendMail({
      from: AUTH_EMAIL,
      to: email,
      subject: 'Email verification',
      html: Verification_Email_Template.replace('{verificationCode}', verification).toString()
    });
    return res.status(201).json({
      status: 'Pending',
      message: 'Email verification code has been sent, check your inbox.'
    });
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({
        status: 'Failed',
        message: 'Something went wrong. Please try again later.',
        error: error.message
      });
    } else {
      console.error('Headers already sent:', error);
    }
  }
};


