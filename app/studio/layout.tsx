import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ecommerce Backend",
  description: "Ecommerce Studio",
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
};

export default RootLayout;