import nodemailer from 'nodemailer';

const port = parseInt(process.env.SMTP_PORT || '587');
const secure = process.env.SMTP_SECURE
  ? process.env.SMTP_SECURE === 'true'
  : port === 465; // 465 = TLS implicite

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Permet de contourner certains certificats intermédiaires en dev
  ...(process.env.SMTP_TLS_INSECURE === 'true'
    ? { tls: { rejectUnauthorized: false } }
    : {}),
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      ...(text ? { text } : {}),
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw new Error("Impossible d'envoyer l'email.");
  }
};


