import "./globals.css";
import Image from "next/image";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export const metadata = {
  title: "المپیار | سامانه آزمون المپیاد",
  description: "ساخت آزمون، شرکت در آزمون و مشاهده کارنامه در المپیار",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense
          fallback={
            <header className="sticky top-0 z-50 h-[72px] border-b border-[#E6EEF8] bg-white/90" />
          }
        >
          <Navbar />
        </Suspense>

        <main className="min-h-[75vh]">{children}</main>

        <footer className="mt-16 border-t border-border bg-white py-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-sm text-gray-500 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2">
              <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
                <Image
                  src="/logo.png"
                  alt="لوگوی المپیار"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </span>
              <span className="font-bold" style={{ color: "#002760" }}>
                المپیار
              </span>
              <span className="text-gray-400">—</span>
              <span>سامانه آزمایشی آزمون‌های المپیاد</span>
            </div>

            <div className="text-xs text-gray-400">
              © 2025 تمامی حقوق محفوظ است.
            </div>
          </div>
        </footer>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}