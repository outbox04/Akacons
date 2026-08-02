import type { Metadata } from "next";
import CinematicMotion from "@/components/cinematic-motion";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKACONS Surface Studio | Sơn hiệu ứng thủ công",
  description:
    "Khám phá 218 mẫu sơn hiệu ứng bê tông, sơn vôi Limewash, gỉ sét và ngọc trai từ AKACONS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <CinematicMotion />
        {children}
      </body>
    </html>
  );
}
