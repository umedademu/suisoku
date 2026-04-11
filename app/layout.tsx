import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "推測ツールv0.50",
  description: "推測ツールv0.50"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
