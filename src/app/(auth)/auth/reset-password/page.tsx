import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { notFound } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email: string; otp: string }>;
}) {
  const { email, otp } = await searchParams;

  if (!email || !otp) return notFound();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4 mb-8 text-center px-4">
        <div className="bg-cyan-400 border-2 border-black px-4 py-1 text-sm font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Security
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight italic">
          Reset <br /> Password
        </h1>
        <p className="text-lg font-medium text-gray-700 max-w-sm">
          Set your new password to regain access to your account.
        </p>
      </div>

      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <ResetPasswordForm email={email} otp={otp} />
      </div>
    </div>
  );
}
