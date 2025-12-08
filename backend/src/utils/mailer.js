import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendApprovalEmail(to, name) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Conta aprovada - K3 Machine',
    text: `Olá, ${name}!\n\nSua conta foi aprovada pelo administrador. Você já pode acessar a plataforma.\n\nAtenciosamente,\nEquipe K3 Machine`,
  });
}
