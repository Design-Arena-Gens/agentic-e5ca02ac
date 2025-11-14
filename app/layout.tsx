import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Video Creation Studio",
  description: "Multi-stage AI video creation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-textPrimary">
        {children}
      </body>
    </html>
  );
}
