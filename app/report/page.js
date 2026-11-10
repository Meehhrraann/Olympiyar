'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { storage } from '@/lib/storage';
import ReportCard from '@/components/ReportCard';

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [latest, setLatest] = useState('');

  const reload = async () => {
  const list = await storage.getReports();
  setReports(list.slice().reverse());
};

useEffect(() => {
  reload();
  setLatest(new URLSearchParams(window.location.search).get("latest") || "");
}, []);

async function handleDeleteAll() {
  if (!confirm("تمام کارنامه‌ها حذف شوند؟")) return;
  const list = await storage.getReports();
  await Promise.all(list.map(r => storage.deleteReport(r.id)));
  reload();
}

async function handleDeleteOne(id) {
  if (!confirm("این کارنامه حذف شود؟")) return;
  await storage.deleteReport(id);
  reload();
}

  return (
    <div className="w-full py-10">
      {/* ============ Hero (full width) ============ */}
      <section
        className="mb-10 w-full overflow-hidden rounded-3xl p-6 md:p-8 text-white"
        style={{
          background:
            'linear-gradient(135deg, #002760 0%, #0E4AB1 55%, #057CD4 100%)',
        }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,320px)_1fr]">
            {/* تصویر — چپ */}
            <div className="order-2 md:order-1 relative mx-auto h-44 w-full max-w-[320px] md:h-52">
              <Image
                src="/report.png"
                alt="کارنامه‌های المپیار"
                fill
                sizes="(max-width: 768px) 90vw, 320px"
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>

            {/* متن — راست */}
            <div className="order-1 md:order-2 text-center md:text-right space-y-3">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                کارنامه‌ها
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                کارنامه‌های من
              </h1>
              <p className="text-white/85 max-w-lg mx-auto md:mx-0">
                تمام تلاش‌های ثبت‌شده شما در این مرورگر. نتیجه هر آزمون را
                می‌توانید بررسی کنید یا دوباره در آن شرکت کنید.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleDeleteAll}
                  disabled={reports.length === 0}
                  className="btn"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.35)',
                  }}
                >
                  <Trash2 size={16} />
                  حذف همه کارنامه‌ها
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ لیست کارنامه‌ها (60% width, centered) ============ */}
      <div className="mx-auto w-full md:w-[60%] px-4 space-y-6">
        {reports.map((r) => (
          <div
            key={r.id}
            id={r.id}
            className={
              latest === r.id
                ? 'rounded-2xl transition'
                : 'transition'
            }
          >
            {/* نوار اکشن بالای هر کارت */}
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="text-xs text-gray-400">
                {latest === r.id && (
                  <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-brand-700 font-medium">
                    جدیدترین
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/exam/${encodeURIComponent(r.examId)}`}
                  className="btn btn-outline text-sm"
                >
                  <RotateCcw size={15} />
                  شرکت مجدد
                </Link>
                <button
                  onClick={() => handleDeleteOne(r.id)}
                  className="btn text-sm"
                  style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                  }}
                >
                  <Trash2 size={15} />
                  حذف
                </button>
              </div>
            </div>

            <ReportCard report={r} />
          </div>
        ))}

        {reports.length === 0 && (
          <div className="card py-16 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-600 font-medium">
              هنوز کارنامه‌ای ندارید.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              پس از شرکت در یک آزمون، نتیجه اینجا نمایش داده می‌شود.
            </p>
            <Link href="/exam" className="btn btn-primary mt-6 inline-flex">
              رفتن به آزمون‌ها
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}