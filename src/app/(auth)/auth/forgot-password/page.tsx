import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <div className="bg-orange-400 border-2 border-black px-3 py-1 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Security
        </div>
        <h1 className="text-5xl font-black uppercase">
          Forgot <br /> Password
        </h1>
        <p className="text-lg font-medium text-gray-600 max-w-xs">
          Enter your email to receive a password reset link
        </p>
      </div>

      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
