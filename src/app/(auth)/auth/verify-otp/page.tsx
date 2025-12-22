import { ResetPasswordOTP } from "@/features/auth/components/reset-password-otp";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-12 px-4">
      <div className="flex flex-col items-center gap-2 mb-12 text-center">
        <div className="bg-pink-400 border-2 border-black px-4 py-1.5 text-xs font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          Verification
        </div>
        <h1 className="text-6xl font-black uppercase leading-[0.9] mt-2">
          Verify <br /> <span className="text-cyan-500">Your Identity</span>
        </h1>
        <p className="text-lg font-bold text-gray-700 max-w-xs mt-4">
          We've sent a 6-digit code to your email. Enter it below to proceed.
        </p>
      </div>

      <div className="w-full max-w-md bg-white border-8 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute -top-4 -right-4 bg-yellow-400 border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xs uppercase -rotate-6">
          Security Check
        </div>
        <ResetPasswordOTP email={email} />
      </div>
    </div>
  );
}
