import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rocket Simulator",
  description: "Simple Rocket Launch Simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="full">
      <body className="full">{children}</body>
    </html>
  );
}
