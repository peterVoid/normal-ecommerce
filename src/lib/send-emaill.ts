"use server";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "haikalprasetya.alhakim12@gmail.com",
    pass: process.env.GOOGLE_APP_PASSWORD!,
  },
});

export async function sendEmail({
  sendTo,
  subject,
  text,
  html,
}: {
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.log("Email server not verified", error);
    return;
  }

  const info = await transporter.sendMail({
    from: "brutalshop@gmail.com",
    to: sendTo,
    subject,
    text,
    html: html || "",
  });

  console.log("Email sent: ", info.messageId);
  return info;
}
