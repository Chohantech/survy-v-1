"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import initSocket from "@/lib/socket";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface Auth {
  token: string;
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isPending && !data?.session) {
      router.push("/sign-in");
    }
  }, [data?.session, isPending, router]);

  // Initialize socket connection
  useEffect(() => {
    if (!data?.session?.token) return;

    const socket = initSocket({ token: data.session.token as string });
    (socket.auth as Auth).token = data.session.token as string; // ensure token is fresh
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [data?.session?.token]);

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Don't render children if not authenticated (redirect will happen)
  if (!data?.session) {
    return null;
  }

  return <>{children}</>;
};

export default MainLayout;
