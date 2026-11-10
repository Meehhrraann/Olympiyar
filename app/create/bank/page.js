"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Search, Trash2 } from "lucide-react";
import QuestionEditor from "@/components/QuestionEditor";
import MathText from "@/components/MathText";

export default function BankPage() {
  const [questions,setQuestions] = useState([]);
  const [selected,setSelected] = useState([]);
  const [search,setSearch] = useState("");
  const [title,setTitle] = useState("آزمون بانک سؤال");
  const [duration,setDuration] = useState(30);
  const [showEditor,setShowEditor] = useState(false);
  const router = useRouter();
  const reload = async () => {
  const qs = await storage.getQuestions();
  setQuestions(qs);
};


useEffect(() => { reload(); }, []);
  const filtered = useMemo(()=>questions.filter(q=>`${q.id} ${q.text} ${q.subject} ${q.topic}`.toLowerCase().includes(search.toLowerCase())),[questions,search]);
  async function create() {
    const chosen = questions.filter(q=>selected.includes(q.id));
    if (!title.trim() || !chosen.length) return toast.error("عنوان و حداقل یک سؤال انتخاب کنید.");
    await storage.saveExam({title,duration:Math.max(1,Number(duration)||1),questions:chosen,source:"bank"});
    toast.success("آزمون ساخته شد.");
    router.push("/exam/online");
  }
  return <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
    <div><h1 className="section-title">بانک سؤالات و ساخت آزمون</h1><p className="mt-2 text-gray-500">با شناسه یا متن سؤال جست‌وجو کنید، سؤال انتخاب کنید یا سؤال تازه بسازید.</p></div>
    <div className="card grid gap-3 md:grid-cols-2">
      <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان آزمون"/>
      <input className="input" type="number" min="1" value={duration} onChange={e=>setDuration(e.target.value)} />
      <div className="relative md:col-span-2"><Search className="absolute right-3 top-3 text-gray-400"/><input className="input pr-10" value={search} onChange={e=>setSearch(e.target.value)} placeholder="جست‌وجو با شناسه، متن، درس یا مبحث"/></div>
      <div className="flex flex-wrap items-center justify-between gap-2 md:col-span-2">
        <span className="text-sm text-gray-600">انتخاب‌شده: {selected.length}</span>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-outline" onClick={()=>setShowEditor(v=>!v)}>{showEditor?"بستن فرم سؤال":"افزودن سؤال دستی به آزمون"}</button>
          <button className="btn btn-danger" onClick={async ()=>{if(confirm("همه سؤال‌ها، آزمون‌ها و کارنامه‌ها برای همیشه از این مرورگر پاک شوند؟")){  await storage.deleteQuestion(q.id);
;reload();setSelected(old => old.filter(id => id !== q.id));toast.success("تمام اطلاعات المپیار پاک شد.");}}}>ریست کامل اطلاعات</button>
        </div>
      </div>
    </div>
    {showEditor && <QuestionEditor bankMode={false} onAdd={q=>{setQuestions(old=>[...old,q]);setSelected(old=>[...old,q.id]);setShowEditor(false);}}/>}
    <div className="space-y-3">
      {filtered.map(q=><div key={q.id} className="card flex items-start gap-3">
        <input type="checkbox" className="mt-2" checked={selected.includes(q.id)} onChange={e=>setSelected(old=>e.target.checked?[...old,q.id]:old.filter(id=>id!==q.id))}/>
        <div className="min-w-0 flex-1"><div className="mb-1 text-xs font-bold text-brand-500">{q.id} | {q.subject || "بدون درس"} | {q.topic || "بدون مبحث"}</div><MathText text={q.text}/><div className="mt-2 text-xs text-gray-500">{q.options?.length || 0} گزینه</div></div>
        <button className="text-red-500" aria-label="حذف سؤال" onClick={()=>{if(confirm("این سؤال از بانک حذف شود؟")){storage.deleteQuestion(q.id);reload();setSelected(old=>old.filter(id=>id!==q.id));}}}><Trash2 size={18}/></button>
      </div>)}
      {!filtered.length && <div className="card text-center text-gray-500">سؤالی پیدا نشد. می‌توانید سؤال جدید بسازید.</div>}
    </div>
    <button className="btn btn-primary w-full" onClick={create}>ساخت آزمون از سؤال‌های انتخاب‌شده</button>
  </div>;
}
