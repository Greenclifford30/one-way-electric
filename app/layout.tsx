import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "One Way Electric",
  description: "Professional Electrical Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-geist">
        {children}
      </body>
    </html>
  );
}