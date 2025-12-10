import AuthBottomSheet from "@/components/auth/auth-bottom-sheet";
import Image from "next/image";
import React from "react";

interface AuthProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthProps) => {
  return (
    <main className="w-full md:h-screen overflow-y-hidden flex">
      <div className="h-full flex-1 flex flex-col items-center justify-center max-md:hidden">
        <Image src="/icons/logo-gray.png" alt="logo" width={100} height={75} />
        {children}
      </div>
      <div className="flex-1 max-md:hidden h-full relative">
        <Image src="/images/login.png" alt="auth-aside" fill />
        <div className="absolute top-[5%] left-[30%] max-3xl:left-[15%] flex flex-col items-center justify-center">
          <div className="max-3xl:w-[240px] max-3xl:h-[400px] max-2xl:h-[700px] w-[464px] h-[820px] relative">
            <Image src="/images/iphone-device.png" alt="iphone-device" fill />
          </div>
          <Image
            src="/images/layout.png"
            alt="layout"
            width={549}
            height={309}
          />
        </div>
      </div>
      <div className="md:hidden flex flex-col w-full h-screen">
        <div className="w-full flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background image for mobile */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/login.png"
              alt="auth-aside"
              fill
              className="object-cover"
            />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 w-full">
            <div className="w-full">{children}</div>
          </div>
        </div>
        <div className="h-[70px]">
          <AuthBottomSheet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
