"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: ({ error }) => {
          toast.error(error.message ?? "Something went wrong");
        },
      },
    });

    setIsSubmitting(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase">Email</label>
        <div className="flex items-center border-4 border-black p-3 gap-3 focus-within:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Mail className="size-5" />
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="w-full outline-hidden bg-transparent font-medium placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase">Password</label>
        <div className="flex items-center border-4 border-black p-3 gap-3 focus-within:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Lock className="size-5" />
          <input
            type="password"
            name="password"
            placeholder="********"
            className="w-full outline-hidden bg-transparent font-medium placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="size-5 border-2 border-black rounded-none accent-black"
          />
          <label
            htmlFor="remember"
            className="text-xs font-bold uppercase cursor-pointer"
          >
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-xs font-bold uppercase hover:text-cyan-600"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        className="w-full bg-cyan-400 hover:bg-cyan-500 border-4 border-black h-12 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "LOGIN"}
      </Button>
    </form>
  );
}
