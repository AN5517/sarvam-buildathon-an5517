import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Group Whisperer",
  description: "Answer family-group misinformation kindly, in the sender's language.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
