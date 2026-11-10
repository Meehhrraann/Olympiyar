"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import QuestionEditor from "@/components/QuestionEditor";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

export default function ManualExamPage() {
  const [title, setTitle] = useState("آزمون دستی جدید");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  async function create() {
  if (!title.trim() || !questions.length) return toast.error("...");
  await storage.saveExam({
    title,
    duration: Math.max(1, Number(duration) || 1),
    questions,
    source: "manual",
  });
  toast.success("آزمون ساخته شد.");
  router.push("/exam/online");
}

  return <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
    <div><h1 className="section-title">ساخت آزمون دستی</h1><p className="mt-2 text-gray-500">ابتدا مشخصات آزمون را وارد کنید و سپس سؤال‌ها را اضافه کنید.</p></div>
    <div className="card grid gap-3 md:grid-cols-2">
      <div><label className="mb-1 block text-sm font-bold">عنوان آزمون</label><input className="input" value={title} onChange={e=>setTitle(e.target.value)} /></div>
      <div><label className="mb-1 block text-sm font-bold">زمان آزمون (دقیقه)</label><input className="input" type="number" min="1" value={duration} onChange={e=>setDuration(e.target.value)} /></div>
      <div className="font-bold text-brand-700 md:col-span-2">تعداد سؤال‌های اضافه‌شده: {questions.length}</div>
    </div>
    <QuestionEditor onAdd={q=>setQuestions(old=>[...old,q])} />
    {questions.length > 0 && <div className="card space-y-3"><h2 className="font-bold text-brand-900">سؤال‌های آزمون</h2>{questions.map((q,i)=><div key={`${q.id}-${i}`} className="flex items-center justify-between gap-3 border-b pb-2"><span className="line-clamp-2">{i+1}. {q.text}</span><button className="text-sm text-red-600" onClick={()=>setQuestions(old=>old.filter((_,j)=>j!==i))}>حذف</button></div>)}<button className="btn btn-primary w-full" onClick={create}>ثبت و ساخت آزمون</button></div>}
  </div>;
}
