import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['vietnamese', 'latin'] });

export const metadata: Metadata = {
  title: 'Meey Toolkit - AI Sinh Biểu Mẫu',
  description: 'Trợ lý AI giúp tạo nhanh các biểu mẫu giao dịch bất động sản chuyên nghiệp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body className={`${inter.className} min-h-screen bg-[#f4f7fe] antialiased`}>
        {children}
      </body>
    </html>
  );
}
