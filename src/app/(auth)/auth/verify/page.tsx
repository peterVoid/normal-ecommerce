import { SendVerificationEmailForm } from "@/features/auth/components/send-verification-email-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;

  if (!error) return redirect("/");

  const isInvalidToken = error === "invalid_token" || error === "token_expired";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-main border-2 border-border shadow-shadow flex items-center justify-center mb-2">
            {isInvalidToken ? (
              <AlertCircle className="w-8 h-8 text-main-foreground" />
            ) : (
              <Mail className="w-8 h-8 text-main-foreground" />
            )}
          </div>
          <CardTitle className="text-3xl uppercase tracking-tighter">
            Verify Email
          </CardTitle>
          <CardDescription className="text-base font-bold text-foreground/80">
            {isInvalidToken
              ? "Your verification link has expired or is no longer valid."
              : "We need to verify your email address before you can continue."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            className={cn(
              "p-4 border-2 border-border shadow-shadow font-bold text-sm",
              isInvalidToken ? "bg-red-200" : "bg-main/20"
            )}
          >
            {error === "invalid_token" || error === "token_expired"
              ? "ERROR: INVALID_TOKEN_OR_EXPIRED"
              : error === "email_not_verified"
              ? "STATUS: EMAIL_NOT_VERIFIED"
              : "STATUS: UNKNOWN_ERROR"}
          </div>

          <SendVerificationEmailForm />

          <div className="pt-4 border-t-2 border-border flex justify-center">
            <Link
              href="/auth/signin"
              className={cn(
                buttonVariants({ variant: "neutral", size: "sm" }),
                "w-full"
              )}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
