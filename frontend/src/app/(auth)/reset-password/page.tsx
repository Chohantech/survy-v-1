import DesktopResetPasswordForm from "@/components/auth/forms/desktop-reset-password-form";
import ResetPasswordForm from "@/components/auth/forms/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React, { Suspense } from "react";

const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading Reset Password</div>}>
      <>
      <div className="flex flex-col gap-5 w-[70%] max-md:hidden">
        <h1 className="font-semibold text-[#AFC2CF] text-2xl">Create new Password</h1>
        <DesktopResetPasswordForm/>
      </div>
        <div className="md:hidden flex flex-col gap-3 items-center">
          <Image
            src={"/icons/logo-gray.png"}
            width={150}
            height={150}
            alt="logo"
          />
          <ResetPasswordForm />
        </div>
      </>
    </Suspense>
  );
};

export default ResetPassword;
