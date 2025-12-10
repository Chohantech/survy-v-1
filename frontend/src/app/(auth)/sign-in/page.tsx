import MobileSigninForm from "@/components/auth/forms/mobile-signin-form";
import SigninForm from "@/components/auth/forms/signin-form";
import Link from "next/link";

const SignIn = () => {
  return (
    <>
      <div className="flex flex-col gap-5 w-[70%] max-md:hidden">
        <h1 className="font-bold text-[#AFC2CF] text-3xl">Sign In</h1>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
        <SigninForm />
      </div>
      <div className="md:hidden flex flex-col gap-3 items-center">
        <MobileSigninForm />
      </div>
    </>
  );
};

export default SignIn;
