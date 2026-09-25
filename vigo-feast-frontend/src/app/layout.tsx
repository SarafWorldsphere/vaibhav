import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIGO FEAST",
  description: "VIGO FEAST Admin Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
