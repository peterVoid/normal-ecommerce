"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

interface SignInOAuthProps {
  provider: "google";
  className?: string;
}

export function SignInOAuth({ provider, className }: SignInOAuthProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    await authClient.signIn.social({
      provider,
      errorCallbackURL: "/auth/login/error",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  };

  return (
    <Button
      className={`w-full bg-white border-4 border-black h-12 font-bold hover:bg-gray-50 ${className}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {provider.toUpperCase()}
    </Button>
  );
}
