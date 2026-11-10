"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { parseExamText } from "@/lib/questionParser";
import { storage } from "@/lib/storage";

export default function ImportExamPage() {
  const [title,setTitle] = useState("آزمون واردشده");
  const [duration,setDuration] = useState(30);
  const [raw,setRaw] = useState("");
  const [preview,setPreview] = useState(null);
  const router = useRouter();

  function convert() {
    try {
      const parsed = parseExamText(raw);
      setPreview(parsed);
      toast.success(`${parsed.questions.length} سؤال شناسایی شد.`);
    } catch(e) { setPreview(null); toast.error(e.message); }
  }
  async function create() {
  if (!preview) return toast.error("ابتدا متن را تبدیل کنید.");
  const exam = await storage.saveExam({
    title,
    duration: Math.max(1, Number(duration) || 1),
    questions: preview.questions,
    source: "prompt-import",
  });
  toast.success("آزمون ساخته شد.");
  router.push("/exam/online");
}
  return <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
    <div><h1 className="section-title">ورود آزمون با قالب هوشمند</h1><p className="mt-2 text-gray-600">خروجی ChatGPT را با قالب مشخص‌شده Paste کنید. برنامه بدون API آن را پارس می‌کند.</p></div>
    <div className="card space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className="mb-1 block text-sm font-bold">عنوان آزمون</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} /></div>
        <div><label className="mb-1 block text-sm font-bold">زمان آزمون (دقیقه)</label><input className="input" type="number" min="1" value={duration} onChange={e=>setDuration(e.target.value)} /></div>
      </div>
      <label className="block text-sm font-bold">متن خروجی (شامل سؤال‌ها و kilid:)</label>
      <textarea className="input min-h-[420px] font-mono text-sm" dir="auto" value={raw} onChange={e=>{setRaw(e.target.value);setPreview(null);}} placeholder="خروجی کامل قالب‌دار را اینجا Paste کنید..." />
      <button className="btn btn-primary w-full" onClick={convert}>بررسی و تبدیل سؤال‌ها</button>
    </div>
    {preview && <div className="card space-y-4">
      <h2 className="text-lg font-black text-brand-900">پیش‌نمایش تبدیل</h2>
      <p>تعداد سؤال: {preview.questions.length}</p>
      {preview.missingKeys.length > 0 && <p className="rounded-lg bg-amber-50 p-3 text-amber-800">کلید سؤال‌های {preview.missingKeys.join("، ")} نامشخص است. این سؤال‌ها در آزمون قابل استفاده نیستند تا کلیدشان مشخص شود.</p>}
      <div className="max-h-96 space-y-3 overflow-auto">{preview.questions.map((q,i)=><div key={q.id} className="rounded-lg border p-3"><b>سؤال {i+1}</b><p className="mt-1 whitespace-pre-wrap">{q.text}</p><p className="mt-2 text-sm text-gray-500">{q.options.length} گزینه | پاسخ صحیح: {q.correctAnswer === null ? "نامشخص" : q.correctAnswer+1}</p></div>)}</div>
      <button className="btn btn-primary w-full" onClick={create} disabled={preview.questions.some(q=>q.correctAnswer===null)}>ساخت آزمون و ذخیره</button>
      {preview.questions.some(q=>q.correctAnswer===null) && <p className="text-sm text-red-600">برای ساخت آزمون باید کلید همه سؤال‌ها مشخص باشد.</p>}
    </div>}
    <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">توجه: این ابزار تولیدکننده هوش مصنوعی نیست؛ خروجی مدل را طبق قرارداد قالبی شما به داده‌های قابل استفاده در آزمون تبدیل می‌کند.</div>
  </div>;
}
