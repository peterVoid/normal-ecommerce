import { EMAIL_VERIFICATION_TEMPLATE } from "@/constants";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { sendEmail } from "./send-emaill";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        sendTo: user.email,
        subject: "Reset your password",
        text: `Please click the link below to reset your password: ${url}`,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 3600,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/auth/verify");

      await sendEmail({
        sendTo: user.email,
        subject: "Verify your email address",
        text: `Please click the link below to verify your email address: ${link.toString()}`,
        html: EMAIL_VERIFICATION_TEMPLATE(link.toString()),
      });
    },
  },
  user: {
    additionalFields: {
      isAdmin: {
        type: "boolean",
        defaultValue: false,
        required: true,
      },
      gender: {
        type: "string",
        required: false,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      dateOfBirth: {
        type: "date",
        required: false,
      },
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  advanced: {
    cookiePrefix: "brutalshop",
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ otp, type, email }) {
        if (type === "forget-password") {
          await sendEmail({
            sendTo: email,
            subject: "Reset your password",
            text: `Please click the link below to reset your password: ${otp}`,
          });
        }
      },
      expiresIn: 3600 * 24,
    }),
  ],
});
