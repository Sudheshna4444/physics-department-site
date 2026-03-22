import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Department of Physics",
  description: "A modern Physics Department portal for notes, syllabus, circulars, events, and achievements."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
