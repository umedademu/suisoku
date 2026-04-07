import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "推測ツールv0.38",
  description: "推測ツールv0.38"
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
