import { Resend } from "resend";
import nodemailer from "nodemailer";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendLaunchEmail(to: string, html: string) {
  if (resend) {
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "alerts@launchpulse.app",
      to,
      subject: "Novo lançamento disponível",
      html,
    });
    return;
  }

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST ?? "localhost",
    port: Number(process.env.EMAIL_SERVER_PORT ?? 1025),
    secure: false,
  });

  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "alerts@launchpulse.app",
    to,
    subject: "Novo lançamento disponível",
    html,
  });
}
