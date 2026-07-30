import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AKACONS Surface Studio | Sơn hiệu ứng thủ công',
  description: 'Khám phá 218 mẫu sơn hiệu ứng bê tông, sơn vôi Limewash, gỉ sét và ngọc trai từ AKACONS.',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
