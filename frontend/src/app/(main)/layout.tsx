"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import SocketProvider from "./socket-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Only redirect if we're not loading and there's no session
    if (!isPending && !session?.session) {
      console.log("No session found, redirecting to sign-in");
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  // Show loading while checking session
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no session, don't render children (will redirect)
  // if (!session?.session) {
  //   return null;
  // }

  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
};

export default MainLayout;
