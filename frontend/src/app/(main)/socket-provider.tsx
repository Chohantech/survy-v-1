"use client";
import React, { useEffect } from "react";
import initSocket from "@/lib/socket";
import { authClient } from "@/lib/auth-client";

interface Auth {
  token: string;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const session = authClient.useSession()
  const token = session.data?.session.token
  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const socket = initSocket({ token });
    (socket.auth as Auth).token = token; // ensure token is fresh
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
  }, [token]);

  return <>{children}</>;
};

export default SocketProvider;

