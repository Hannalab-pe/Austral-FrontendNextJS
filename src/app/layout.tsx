import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import AuthInitializer from "@/components/common/AuthInitializer";
import QueryProvider from "@/providers/QueryProvider";
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
  title: "Austral Seguros - CRM",
  description: "Gestión de clientes y pólizas de seguros",
  icons: {
    icon: "/images/austral-logo.png",
    shortcut: "/images/austral-logo.png",
    apple: "/images/austral-logo.png",
  },
  manifest: "/src/app/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
