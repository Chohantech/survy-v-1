import React from "react";
import SocketProvider from "./socket-provider";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
};

export default MainLayout;
