//src/components/layout/Layout.tsx

import React, { ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ padding: "1rem" }}>{children}</main>
    </>
  );
};

export default Layout;
