import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    EmailProvider({
      name: "Email",
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const nodemailer = await import("nodemailer");
        const transport = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transport.sendMail({
          to: identifier,
          from: provider.from ?? process.env.EMAIL_FROM!,
          subject: "O teu link mágico para o LaunchPulse",
          html: `<p>Entra clicando <a href="${url}">aqui</a>.</p>`,
        });
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const handlers = { GET: handler, POST: handler };

export async function auth() {
  return getServerSession(authOptions);
}
