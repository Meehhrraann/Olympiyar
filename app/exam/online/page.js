"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { storage } from "@/lib/storage";
import { Clock3, FileText, Trash2 } from "lucide-react";

export default function OnlineExamsPage() {
  const [exams, setExams] = useState([]);

  const reload = async () => {
    const list = await storage.getExams();
    setExams(list.slice().reverse());
  };

  useEffect(() => {
    reload();
  }, []);

  async function handleDelete(id) {
    if (!confirm("آزمون حذف شود؟")) return;
    await storage.deleteExam(id);
    reload();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">آزمون‌های آنلاین</h1>
          <p className="mt-2 text-gray-500">یک آزمون را انتخاب کنید و شروع کنید.</p>
        </div>
        <Link href="/create" className="btn btn-outline">ساخت آزمون جدید</Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {exams.map((exam) => (
          <div key={exam.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-black text-brand-900">{exam.title}</h2>
              <button
                className="text-red-500"
                title="حذف آزمون"
                onClick={() => handleDelete(exam.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-2"><FileText size={16} />{exam.questions.length} سؤال</span>
              <span className="flex items-center gap-2"><Clock3 size={16} />{exam.duration} دقیقه</span>
            </div>
            <Link
              href={`/exam/${encodeURIComponent(exam.id)}`}
              className="btn btn-primary mt-6 w-full"
            >
              شروع آزمون
            </Link>
          </div>
        ))}

        {!exams.length && (
          <div className="card py-12 text-center text-gray-500 md:col-span-2">
            هنوز آزمونی ساخته نشده است. از بخش آزمون‌ساز یک آزمون ایجاد کنید.
          </div>
        )}
      </div>
    </div>
  );
}