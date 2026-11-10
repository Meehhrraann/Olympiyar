"use client";

import { useEffect, useState } from "react";
import { OLYMPIADS } from "@/constants/olympiads";
import { storage, createId } from "@/lib/storage";
import MathField from "@/components/MathField";
import MathText from "@/components/MathText";
import { toast } from "sonner";

const blank = () => ({
  id: "",                     // temporary empty id
  text: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
  explanation: "",
  olympiadId: "",
  subject: "",
  chapter: "",
  topic: "",
});

export default function QuestionEditor({ onAdd, initialQuestion = null, bankMode = true }) {
  const [q, setQ] = useState(initialQuestion || blank());
  const [saveToBank, setSaveToBank] = useState(bankMode);
  const [editingId, setEditingId] = useState(initialQuestion?.id || null);

  useEffect(() => {
    setQ((old) => (old.id ? old : { ...old, id: createId("Q") }));
  }, []);

  const update = (key, value) => setQ(old => ({ ...old, [key]: value }));
  const updateOption = (i, value) => setQ(old => ({ ...old, options: old.options.map((x, j) => i === j ? value : x) }));

  function insertFormula(latex, target) {
    const token = `\\(${latex}\\)`;
    if (target === "option") {
      const i = q._activeOption ?? 0;
      updateOption(i, `${q.options[i]} ${token}`.trim());
    } else {
      update(target, `${q[target] || ""} ${token}`.trim());
    }
  }

  async function save() {
    if (!q.text.trim()) return toast.error("متن سؤال را وارد کنید.");
    if (q.options.length !== 4 || q.options.some(x => !x.trim())) return toast.error("هر چهار گزینه را تکمیل کنید.");
    if (!q.explanation.trim()) return toast.error("پاسخ تشریحی را وارد کنید.");
    const finalId = q.id || createId("Q");   // ← safe: runs in an event handler
  const clean = { ...q, id: finalId };
  delete clean._activeOption;

  if (saveToBank) {
    const saved = await storage.saveQuestion({ ...clean, originalId: editingId || undefined });
    onAdd?.(saved);
    toast.success("سؤال در بانک ذخیره و به آزمون اضافه شد.");
  } else {
    onAdd?.({ ...clean, source: "exam-only" });
    toast.success("سؤال اختصاصی به آزمون اضافه شد؛ در بانک ذخیره نشد.");
  }

  setQ(blank());      // reset with empty id again
  setEditingId(null);
}

  const olympiad = OLYMPIADS.find(x => x.id === q.olympiadId);
  const subjects = olympiad?.subjects || [];
  const subject = subjects.find(x => x.name === q.subject);
  const chapters = subject?.chapters || [];
  const chapter = chapters.find(x => x.name === q.chapter);
  const topics = chapter?.topics || [];

  return (
    <div className="card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-black text-brand-900">{editingId ? "ویرایش سؤال" : "طراحی سؤال جدید"}</h2>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-brand-700">شناسه: {q.id}</span>
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold">شناسه سؤال (قابل تغییر)</label>
        <input className="input" value={q.id} onChange={e => update("id", e.target.value)} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold">متن سؤال</label>
        <textarea className="input min-h-28" value={q.text} onChange={e => update("text", e.target.value)} placeholder="صورت سؤال را بنویسید..." />
        <div className="mt-2"><MathField onInsert={latex => insertFormula(latex, "text")} /></div>
        <div className="mt-3 rounded-lg bg-gray-50 p-3"><span className="mb-2 block text-xs font-bold text-gray-500">پیش‌نمایش متن سؤال</span><MathText text={q.text} /></div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {q.options.map((option, i) => <div key={i}>
          <label className="mb-1 block text-sm font-bold">گزینه {i + 1}</label>
          <input className="input" value={option} onFocus={() => update("_activeOption", i)} onChange={e => updateOption(i, e.target.value)} />
          <div className="mt-2"><MathText text={option} /></div>
          {q._activeOption === i && <div className="mt-2"><MathField onInsert={latex => insertFormula(latex, "option")} /></div>}
        </div>)}
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold">گزینه صحیح</label>
        <select className="input" value={q.correctAnswer} onChange={e => update("correctAnswer", Number(e.target.value))}>
          {[0,1,2,3].map(i => <option key={i} value={i}>گزینه {i + 1}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-bold">پاسخ تشریحی</label>
        <textarea className="input min-h-28" value={q.explanation} onChange={e => update("explanation", e.target.value)} placeholder="راه‌حل را وارد کنید..." />
        <div className="mt-2"><MathField onInsert={latex => insertFormula(latex, "explanation")} /></div>
        <div className="mt-3 rounded-lg bg-gray-50 p-3"><MathText text={q.explanation} /></div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className="mb-1 block text-sm font-bold">المپیاد</label><select className="input" value={q.olympiadId} onChange={e => setQ(old => ({...old, olympiadId:e.target.value, subject:"", chapter:"", topic:""}))}><option value="">انتخاب المپیاد</option>{OLYMPIADS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
        <div><label className="mb-1 block text-sm font-bold">درس</label><select className="input" value={q.subject} onChange={e => setQ(old => ({...old, subject:e.target.value, chapter:"", topic:""}))}><option value="">انتخاب درس</option>{subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select></div>
        <div><label className="mb-1 block text-sm font-bold">فصل</label><select className="input" value={q.chapter} onChange={e => setQ(old => ({...old, chapter:e.target.value, topic:""}))}><option value="">انتخاب فصل</option>{chapters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
        <div><label className="mb-1 block text-sm font-bold">مبحث</label><select className="input" value={q.topic} onChange={e => update("topic", e.target.value)}><option value="">انتخاب مبحث</option>{topics.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}</select></div>
      </div>
      <label className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"><input type="checkbox" checked={saveToBank} onChange={e => setSaveToBank(e.target.checked)} /><span className="text-sm font-semibold">ذخیره این سؤال در بانک سؤالات</span></label>
      <button type="button" onClick={save} className="btn btn-primary w-full">ذخیره سؤال و افزودن به آزمون</button>
    </div>
  );
}
