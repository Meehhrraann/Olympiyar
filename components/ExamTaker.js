"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import MathText from "@/components/MathText";

export default function ExamTaker({ examId }) {
  const router = useRouter();
  const [exam,setExam] = useState(null);
  const [answers,setAnswers] = useState({});
  const [remaining,setRemaining] = useState(0);
  const [startedAt,setStartedAt] = useState(null);
  const submitted = useRef(false);

  useEffect(() => {
  (async () => {
    const exams = await storage.getExams();
    const found = exams.find(e => e.id === examId);
    if (found) {
      setExam(found);
      setRemaining(Math.max(1, Number(found.duration) || 1) * 60);
      setStartedAt(Date.now());
    }
  })();
}, [examId]);

  const finish = useCallback(async(auto=false)=>{
    if(!exam || submitted.current) return;
    submitted.current=true;
    const qs=exam.questions || [];
    let correct=0,wrong=0,unanswered=0;
    const topics={};
    qs.forEach((q,i)=>{
      const topic=q.topic || q.subject || "سایر";
      if(!topics[topic]) topics[topic]={total:0,correct:0,wrong:0,unanswered:0};
      topics[topic].total++;
      if(answers[i]===undefined){unanswered++;topics[topic].unanswered++;}
      else if(Number(answers[i])===Number(q.correctAnswer)){correct++;topics[topic].correct++;}
      else {wrong++;topics[topic].wrong++;}
    });
    const report = await storage.saveReport({
      examId:exam.id,examTitle:exam.title,total:qs.length,correct,wrong,unanswered,
      percentage:qs.length?Math.round(correct/qs.length*100):0,
      topics,answers,questions:qs,startedAt,finishedAt:new Date().toISOString(),autoSubmitted:auto
    });
    toast.success(auto ? "زمان آزمون تمام شد؛ کارنامه ثبت شد." : "آزمون ثبت شد.");
  router.push(`/report?latest=${encodeURIComponent(report.id)}`);
  },[exam,answers,startedAt,router]);

  useEffect(()=>{
    if(!exam || startedAt===null || submitted.current) return;
    const timer=setInterval(()=>{
      const elapsed=Math.floor((Date.now()-startedAt)/1000);
      const left=Math.max(0,Number(exam.duration)*60-elapsed);
      setRemaining(left);
      if(left<=0) finish(true);
    },500);
    return ()=>clearInterval(timer);
  },[exam,startedAt,finish]);

  if(!exam) return <div className="mx-auto max-w-3xl p-12 text-center">آزمون پیدا نشد.</div>;
  const mm=Math.floor(remaining/60), ss=remaining%60;

  return <div className="mx-auto max-w-4xl px-4 py-8">
    <div className="sticky top-[68px] z-20 mb-6 flex items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div><h1 className="font-black text-brand-900">{exam.title}</h1><p className="text-xs text-gray-500">{exam.questions.length} سؤال</p></div>
      <div className={`rounded-lg px-4 py-2 font-black tabular-nums ${remaining<60?"bg-red-50 text-red-600":"bg-blue-50 text-brand-700"}`}>{String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</div>
    </div>
    <div className="space-y-5">
      {exam.questions.map((q,i)=><section key={`${q.id}-${i}`} className="card">
        <div className="mb-4 flex items-center justify-between gap-2"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-brand-700">سؤال {i+1}</span><span className="text-xs text-gray-400">{q.topic || q.subject || ""}</span></div>
        <div className="mb-5 font-semibold leading-8"><MathText text={q.text}/></div>
        <div className="space-y-2">{q.options.map((option,j)=><label key={j} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${answers[i]===j?"border-brand-500 bg-blue-50":"border-border hover:bg-gray-50"}`}>
          <input type="radio" name={`q-${i}`} className="mt-2" checked={answers[i]===j} onChange={()=>setAnswers(old=>({...old,[i]:j}))}/>
          <span className="flex-1"><b className="ml-2">{["۱","۲","۳","۴"][j]}.</b><MathText text={option}/></span>
        </label>)}</div>
      </section>)}
    </div>
    <div className="card mt-6 flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-gray-600">پاسخ‌داده‌شده: {Object.keys(answers).length} از {exam.questions.length}</span><button className="btn btn-primary" onClick={()=>{if(confirm("آزمون پایان یابد و کارنامه ثبت شود؟"))finish(false);}}>پایان آزمون و ثبت کارنامه</button></div>
  </div>;
}
