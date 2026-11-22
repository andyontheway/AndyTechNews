import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechGear Daily - Driving the Future of Tech (Dẫn lối tương lai công nghệ)",
  description: "TechGear Daily - Kênh thông tin hàng đầu cập nhật 24/7 về công nghệ, AI, vi xử lý, phần cứng từ TechPowerUp cùng thế giới siêu xe, xe điện và đánh giá xe từ Top Gear.",
  keywords: ["TechGear Daily", "tin tức công nghệ", "xe cộ", "Top Gear", "TechPowerUp", "xe điện", "siêu xe", "ai", "hardware", "techgear"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">{children}</body>
    </html>
  );
}
