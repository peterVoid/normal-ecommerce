"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SendVerificationEmailForm() {
  const [timer, setTimer] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formData = new FormData(evt.currentTarget);
    const email = formData.get("email") as string;

    if (!email) return toast.error("Please enter your email");

    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/auth/verify",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
          setTimer(60);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: () => {
          setIsPending(false);
          toast.error("Failed to send verification email");
        },
        onSuccess: () => {
          toast.success("Verification email sent");
          setIsCompleted(true);
        },
      },
    });
  };

  useEffect(() => {
    if (isCompleted && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCompleted, timer]);

  return (
    <form className="w-full space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="your@email.com"
          required
          className="bg-white"
        />
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
          We&apos;ll send a new link to this address
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending || timer > 0}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : timer > 0 ? (
          `Resend in ${timer}s`
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Resend Verification Email
          </>
        )}
      </Button>
    </form>
  );
}
