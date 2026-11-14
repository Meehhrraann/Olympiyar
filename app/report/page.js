'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Trash2, RotateCcw } from 'lucide-react';
import { storage } from '@/lib/storage';
import ReportCard from '@/components/ReportCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import { toast } from 'sonner';

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [latest, setLatest] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [dialog, setDialog] = useState({
    open: false,
    mode: null,      // 'one' | 'all'
    id: null,
    loading: false,
  });

  // ============ بارگذاری اولیه — await ============
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await storage.getReports();
        // امن‌سازی: هر چیزی که برگشت، اگر آرایه نبود، آرایه خالی
        const arr = Array.isArray(list) ? list : [];
        if (!cancelled) setReports(arr.slice().reverse());
      } catch (err) {
        console.error('Failed to load reports:', err);
        if (!cancelled) setReports([]);
        toast.error('بارگذاری کارنامه‌ها ناموفق بود');
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();

    setLatest(new URLSearchParams(window.location.search).get('latest') || '');

    return () => {
      cancelled = true;
    };
  }, []);

  // ============ حذف تکی — Optimistic ============
  async function performDeleteOne(id) {
    const before = reports;
    startTransition(() => {
      setReports((rs) => rs.filter((r) => r.id !== id));
    });

    try {
      await storage.deleteReport(id);
      toast.success('کارنامه حذف شد');
    } catch (err) {
      setReports(before);
      toast.error('حذف ناموفق بود — دوباره تلاش کنید');
      console.error(err);
    } finally {
      setDialog({ open: false, mode: null, id: null, loading: false });
    }
  }

  // ============ حذف همه — با Promise.all ============
  async function performDeleteAll() {
    const before = reports;
    startTransition(() => setReports([]));

    try {
      await Promise.all(before.map((r) => storage.deleteReport(r.id)));
      toast.success('همه کارنامه‌ها حذف شدند');
    } catch (err) {
      setReports(before);
      toast.error('حذف ناموفق بود — دوباره تلاش کنید');
      console.error(err);
    } finally {
      setDialog({ open: false, mode: null, id: null, loading: false });
    }
  }

  function confirmAction() {
    if (dialog.mode === 'one') performDeleteOne(dialog.id);
    else if (dialog.mode === 'all') performDeleteAll();
  }

  // ============ حالت بارگذاری اولیه ============
  if (initialLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="section-title mb-6">کارنامه‌های من</h1>
        <div className="card py-16 text-center text-gray-500">
          در حال بارگذاری…
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">کارنامه‌های من</h1>
          <p className="mt-2 text-gray-500">
            تمام تلاش‌های ثبت‌شده شما در این مرورگر.
          </p>
        </div>
        <button
          className="btn text-sm"
          style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
          onClick={() => setDialog({ open: true, mode: 'all', id: null, loading: false })}
          disabled={reports.length === 0}
        >
          <Trash2 size={16} />
          حذف همه کارنامه‌ها
        </button>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {reports.map((r) => (
          <div key={r.id} id={r.id}>
            <div className="mb-2 flex flex-wrap justify-end gap-2">
              <Link
                href={`/exam/${encodeURIComponent(r.examId)}`}
                className="btn btn-outline text-sm"
              >
                <RotateCcw size={15} />
                شرکت مجدد
              </Link>
              <button
                className="btn text-sm"
                style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
                onClick={() =>
                  setDialog({ open: true, mode: 'one', id: r.id, loading: false })
                }
              >
                <Trash2 size={15} />
                حذف
              </button>
            </div>
            <ReportCard report={r} />
          </div>
        ))}

        {reports.length === 0 && (
          <div className="card py-16 text-center text-gray-500">
            هنوز کارنامه‌ای ندارید.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={dialog.open}
        loading={dialog.loading}
        title={dialog.mode === 'all' ? 'حذف همه کارنامه‌ها' : 'حذف کارنامه'}
        description={
          dialog.mode === 'all'
            ? 'آیا از حذف تمام کارنامه‌ها مطمئن هستید؟ این عمل قابل بازگشت نیست.'
            : 'آیا از حذف این کارنامه مطمئن هستید؟'
        }
        onConfirm={() => {
          setDialog((d) => ({ ...d, loading: true }));
          confirmAction();
        }}
        onCancel={() => setDialog({ open: false, mode: null, id: null, loading: false })}
      />
    </div>
  );
}