import { Button } from "@/components/ui/button";
import { SignInOAuth } from "@/features/auth/components/sign-in-oauth";
import { SignInForm } from "@/features/auth/components/signin-form";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="bg-yellow-400 border-2 border-black px-3 py-1 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Account
        </div>
        <h1 className="text-5xl font-black uppercase text-center">
          Welcome <br /> Back
        </h1>
        <p className="text-lg font-medium text-gray-600">
          Login to your bold account
        </p>
      </div>

      <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <SignInForm />

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-2 border-black"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 font-bold text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <SignInOAuth provider="google" />
        </div>

        <div className="mt-8 text-center text-sm font-bold uppercase">
          Need an account?{" "}
          <Link href="/auth/signup" className="underline hover:text-cyan-600">
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
}
