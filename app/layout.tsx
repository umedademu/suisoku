import type { Metadata } from "next";
import "./globals.css";
import { APP_TITLE } from "../lib/app-info";

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_TITLE
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
