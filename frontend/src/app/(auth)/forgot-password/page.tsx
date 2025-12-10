import ForgotPasswordForm from "@/components/auth/forms/forgot-password-form";
import MobileForgotPasswordForm from "@/components/auth/forms/mobile-forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const ForgotPassword = () => {
  return (
    <>
      <div className="flex flex-col gap-5 w-[70%] max-md:hidden">
        <h1 className="font-semibold text-[#AFC2CF] text-2xl">Enter your email below</h1>
        <ForgotPasswordForm />
      </div>
      <div className="md:hidden flex flex-col gap-3 items-center">
        <MobileForgotPasswordForm />
      </div>
    </>
  );
};

export default ForgotPassword;
