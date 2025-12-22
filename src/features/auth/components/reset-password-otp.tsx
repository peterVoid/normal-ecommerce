"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ResetPasswordOTPProps {
  email: string;
}

export function ResetPasswordOTP({ email }: ResetPasswordOTPProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleComplete = async (val: string) => {
    const { error } = await authClient.emailOtp.checkVerificationOtp({
      email,
      type: "forget-password",
      otp: val,
    });

    if (error) {
      return toast.error(error.message);
    }

    router.push(`/auth/reset-password?email=${email}&otp=${val}`);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="space-y-4 w-full flex flex-col items-center">
        <label className="text-xs font-black uppercase bg-black text-white px-2 py-0.5 self-center">
          Enter 6-digit code
        </label>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={setValue}
          onComplete={handleComplete}
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator className="mx-2">
            <div className="w-4 h-1 bg-black" />
          </InputOTPSeparator>
          <InputOTPGroup className="gap-2">
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        className="w-full bg-yellow-400 hover:bg-yellow-500 border-4 border-black h-12 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
        onClick={() => handleComplete(value)}
        disabled={value.length !== 6}
      >
        VERIFY OTP
      </Button>

      <div className="text-center">
        <p className="text-xs font-bold uppercase text-gray-500 mb-1">
          Didn't receive the code?
        </p>
        <button className="text-xs font-black uppercase underline hover:text-orange-600 transition-colors">
          Resend Code
        </button>
      </div>
    </div>
  );
}
