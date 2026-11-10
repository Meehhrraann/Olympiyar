import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  FilePlus2,
  ChartNoAxesColumn,
  Sparkles,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "آزمون‌ساز",
    description:
      "سؤال طراحی کن، بانک سؤالات بساز و آزمون اختصاصی خودت را آماده کن.",
    href: "/create",
    icon: FilePlus2,
    number: "۱",
    color: "#057CD4",
    bg: "bg-[#057CD4]/10",
  },
  {
    title: "شرکت در آزمون",
    description:
      "در آزمون‌های آنلاین شرکت کن و مهارتت را در شرایط واقعی بسنج.",
    href: "/exam",
    icon: ClipboardList,
    number: "۲",
    color: "#0E4AB1",
    bg: "bg-[#0E4AB1]/10",
  },
  {
    title: "کارنامه تحلیلی",
    description:
      "نتایجت را بررسی کن، نقاط قوت و ضعف را بشناس و پیشرفتت را دنبال کن.",
    href: "/report",
    icon: ChartNoAxesColumn,
    number: "۳",
    color: "#057CD4",
    bg: "bg-[#29E3F6]/15",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F9FF]">
      {/* ================= Hero ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-5 md:pt-7">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#002760] via-[#073C88] to-[#0E4AB1] shadow-[0_20px_55px_-25px_rgba(0,39,96,0.45)]">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#057CD4]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#29E3F6]/15 blur-3xl" />

          <div className="relative grid items-center gap-4 px-6 py-7 sm:px-9 md:grid-cols-2 md:gap-6 md:px-10 md:py-8 lg:px-14">
            {/* Text — راست */}
            <div className="order-2 text-right md:order-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#29E3F6]/30 bg-[#29E3F6]/10 px-3 py-1.5 text-[11px] font-semibold text-[#29E3F6] sm:text-xs">
                <Sparkles size={13} />
                سامانه هوشمند شبیه‌سازی آزمون المپیاد
              </div>

              <h1 className="mt-4 text-3xl font-black leading-[1.45] tracking-tight text-white sm:text-4xl lg:text-[44px]">
                مسیر المپیادی‌ات را
                <span className="block text-[#29E3F6]">
                  هوشمندانه بساز
                </span>
              </h1>

              <p className="mt-3 max-w-lg text-xs leading-7 text-blue-100/90 sm:text-sm">
                آزمون طراحی کن، دانش خودت را به چالش بکش و با کارنامه‌های
                تحلیلی، مسیر پیشرفتت را دقیق‌تر بشناس.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link
                  href="/exam"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#30F9D2] px-5 py-3 text-xs font-extrabold text-[#002760] shadow-lg shadow-[#30F9D2]/20 transition-all hover:-translate-y-0.5 hover:bg-[#29E3F6] sm:text-sm"
                >
                  شروع آزمون
                  <ArrowLeft
                    size={16}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                </Link>

                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:text-sm"
                >
                  ساخت آزمون
                  <FilePlus2 size={16} />
                </Link>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[11px] text-blue-100/70">
                <GraduationCap size={16} className="text-[#30F9D2]" />
                <span>یک تجربه متمرکز برای آمادگی المپیادهای علمی</span>
              </div>
            </div>

            {/* Image — چپ */}
            <div className="relative order-1 flex items-center justify-center md:order-2">
              {/* هاله آبی تزئینی */}
              <div className="pointer-events-none absolute h-52 w-52 rounded-full bg-[#29E3F6]/20 blur-3xl md:h-64 md:w-64" />

              {/* کانتینر تصویر با ارتفاع مشخص — ضروری برای fill */}
              <div className="relative z-10 h-[230px] w-full sm:h-[280px] md:h-[310px]">
                <Image
                  src="/hero.png"
                  alt="لوگوی المپیار"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Brand accent */}
          <div className="h-1 w-full bg-gradient-to-l from-[#30F9D2] via-[#29E3F6] to-[#057CD4]" />
        </div>
      </section>

      {/* ================= Features ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#057CD4]">
              <span className="h-1.5 w-7 rounded-full bg-[#30F9D2]" />
              امکانات المپیار
            </div>

            <h2 className="text-xl font-black text-[#002760] sm:text-2xl">
              همه‌چیز برای یک رقابت بهتر
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              از طراحی آزمون تا تحلیل عملکرد، همه ابزارها در یک مسیر.
            </p>
          </div>

          <span className="hidden text-sm font-medium text-[#057CD4] sm:block">
            سه گام تا پیشرفت
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.number}
                href={feature.href}
                className="group relative overflow-hidden rounded-[26px] border border-[#DCE9F8] bg-white p-6 shadow-[0_5px_25px_rgba(0,39,96,0.035)] transition-all duration-300 hover:-translate-y-2 hover:border-[#29E3F6] hover:shadow-[0_18px_40px_rgba(5,124,212,0.12)] sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg}`}
                    style={{ color: feature.color }}
                  >
                    <Icon size={28} strokeWidth={1.9} />
                  </div>

                  <span className="text-3xl font-black text-[#EAF1FA] transition-colors group-hover:text-[#29E3F6]/40">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-extrabold text-[#002760] transition-colors group-hover:text-[#057CD4]">
                  {feature.title}
                </h3>

                <p className="mt-3 min-h-[56px] text-sm leading-7 text-gray-500">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <span className="text-sm font-bold text-[#057CD4]">
                    ورود به بخش
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F7FF] text-[#057CD4] transition-all group-hover:bg-[#057CD4] group-hover:text-white">
                    <ChevronLeft size={19} />
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 h-1 w-0 bg-gradient-to-l from-[#30F9D2] to-[#057CD4] transition-all duration-300 group-hover:w-full" />
              </Link>
            );
          })}
        </div>
      </section>

      
    </main>
  );
}