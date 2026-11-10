
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const links = [
  ["صفحه اصلی", "/"],
  ["آزمون‌ساز", "/create"],
  ["آزمون‌ها", "/exam"],
  ["کارنامه‌ها", "/report"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E6EEF8] bg-white/90 shadow-[0_3px_20px_rgba(0,39,96,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Brand */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#002760] to-[#057CD4] shadow-md shadow-[#057CD4]/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="لوگوی المپیار"
              fill
              sizes="44px"
              className="object-contain p-1.5"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#002760]">
              المپیار
            </span>
            <span className="text-[10px] font-medium text-[#057CD4]">
              مسیر هوشمند المپیاد
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-2xl border border-[#EAF0F8] bg-[#F7FAFE] p-1.5 md:flex">
          {links.map(([label, href]) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                className={`relative rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-white text-[#057CD4] shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-[#057CD4]"
                }`}
              >
                {label}

                {active && (
                  <span className="absolute -bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-[#30F9D2]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/exam"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#057CD4] to-[#0E4AB1] px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-[#057CD4]/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#057CD4]/30"
          >
            <Sparkles size={16} className="text-[#30F9D2]" />
            شروع آزمون
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#DCE9F8] bg-[#F5F9FF] text-[#002760] transition-all hover:border-[#29E3F6] hover:bg-[#EAF8FF] md:hidden"
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <nav className="border-t border-[#EAF0F8] bg-white px-4 pb-4 pt-3">
            <div className="mx-auto grid max-w-7xl gap-1.5">
              {links.map(([label, href]) => {
                const active = isActive(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                      active
                        ? "bg-[#EAF7FF] text-[#057CD4]"
                        : "text-gray-700 hover:bg-[#F5F9FF]"
                    }`}
                  >
                    <span>{label}</span>
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-[#30F9D2]" />
                    )}
                  </Link>
                );
              })}

              <Link
                href="/exam"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#057CD4] to-[#0E4AB1] px-4 py-3 text-sm font-extrabold text-white shadow-md shadow-[#057CD4]/20"
              >
                <GraduationCap size={18} className="text-[#30F9D2]" />
                شروع آزمون
                <ChevronLeft size={17} />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
