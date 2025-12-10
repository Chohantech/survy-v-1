import MobileSignupForm from "@/components/auth/forms/mobile-signup-form";
import SignupForm from "@/components/auth/forms/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const SignUp = () => {
  return (
    <>
      <div className="flex flex-col gap-5 w-[70%] max-md:hidden">
        <h1 className="font-bold text-[#AFC2CF] text-3xl">Create an account</h1>
        <p>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
        <SignupForm />
      </div>
      <div className="md:hidden flex flex-col gap-3 items-center">
        <MobileSignupForm />
      </div>
    </>
  );
};

export default SignUp;
