import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "社長AI アバターデモ",
  description: "顧客企業の社長AIアバターがリアルタイムに対話するデモアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
