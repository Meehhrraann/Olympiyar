'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2, XCircle, MinusCircle, Calendar, Sparkles,
  BarChart3, ListChecks, ChevronDown, Award, Target, HelpCircle,
} from 'lucide-react';
import MathText from '@/components/MathText';

/* ---------- گرید بر اساس درصد ---------- */
const GRADES = [
  { min: 90, label: 'درخشان',        gradient: 'from-emerald-400 to-green-600', ring: '#10b981', emoji: '🏆' },
  { min: 75, label: 'عالی',          gradient: 'from-teal-400 to-cyan-600',     ring: '#06b6d4', emoji: '🌟' },
  { min: 60, label: 'خوب',           gradient: 'from-blue-400 to-indigo-600',   ring: '#3b82f6', emoji: '👍' },
  { min: 40, label: 'متوسط',         gradient: 'from-amber-400 to-orange-500',  ring: '#f59e0b', emoji: '💪' },
  { min: 0,  label: 'نیاز به تمرین', gradient: 'from-rose-400 to-red-600',      ring: '#ef4444', emoji: '📚' },
];
const getGrade = (p) => GRADES.find((g) => p >= g.min) || GRADES[GRADES.length - 1];

/* ---------- حلقه درصد ---------- */
function CircularProgress({ percent = 0, color = '#3b82f6', size = 132, stroke = 11 }) {
  const safe = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (safe / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2f7" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .9s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-gray-800 tabular-nums">{percent}٪</span>
        <span className="text-[10px] font-medium text-gray-400">درصد صحیح</span>
      </div>
    </div>
  );
}

/* ---------- باکس آمار ---------- */
function StatBox({ icon, label, value, tone }) {
  const tones = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    rose:    'bg-rose-50 border-rose-100 text-rose-700',
    gray:    'bg-gray-50 border-gray-200 text-gray-600',
  };
  return (
    <div className={`rounded-2xl border p-3 text-center ${tones[tone]}`}>
      <div className="mb-1 flex items-center justify-center gap-1.5 text-[11px] font-medium opacity-90">
        {icon}<span>{label}</span>
      </div>
      <div className="text-2xl font-black tabular-nums">{value}</div>
    </div>
  );
}

/* ---------- نوار ترکیب پاسخ‌ها ---------- */
function CompositionBar({ correct, wrong, blank }) {
  const total = Math.max(correct + wrong + blank, 1);
  const w = (n) => `${(n / total) * 100}%`;
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
      <div className="bg-emerald-500" style={{ width: w(correct) }} title={`درست: ${correct}`} />
      <div className="bg-rose-500"    style={{ width: w(wrong)   }} title={`غلط: ${wrong}`} />
      <div className="bg-gray-400"    style={{ width: w(blank)   }} title={`بی‌پاسخ: ${blank}`} />
    </div>
  );
}

/* ---------- کارت هر سؤال ---------- */
function QuestionItem({ q, index, selected, status }) {
  const meta = {
    correct: { border: 'border-emerald-200', badge: 'bg-emerald-500', label: 'پاسخ صحیح',  color: 'text-emerald-700', Icon: CheckCircle2 },
    wrong:   { border: 'border-rose-200',    badge: 'bg-rose-500',    label: 'پاسخ نادرست', color: 'text-rose-700',    Icon: XCircle },
    blank:   { border: 'border-gray-200',    badge: 'bg-gray-400',    label: 'بی‌پاسخ',     color: 'text-gray-500',    Icon: MinusCircle },
  }[status];

  const selectedText = selected === undefined || selected === null ? null : q.options?.[selected];
  const correctText  = q.options?.[q.correctAnswer];

  return (
    <div className={`rounded-2xl border-2 bg-white p-4 ${meta.border}`}>
      <div className="mb-3 flex items-start gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${meta.badge}`}>
          {index + 1}
        </span>
        <p className="flex-1 font-bold leading-relaxed text-gray-800">
          <MathText text={q.text} />
        </p>
        <span className={`inline-flex shrink-0 items-center gap-1 text-xs font-bold ${meta.color}`}>
          <meta.Icon size={14} />
          {meta.label}
        </span>
      </div>

      <div className="space-y-2 pr-11">
        <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm">
          <span className="text-xs font-medium text-gray-500">پاسخ شما: </span>
          {selectedText !== null && selectedText !== undefined ? (
            <span className="font-medium text-gray-800"><MathText text={selectedText} /></span>
          ) : (
            <span className="text-gray-400">بی‌پاسخ</span>
          )}
        </div>

        {status !== 'correct' && (
          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm">
            <span className="text-xs font-medium text-emerald-600">پاسخ صحیح: </span>
            <span className="font-bold text-emerald-800">
              <MathText text={correctText || 'کلید نامشخص'} />
            </span>
          </div>
        )}

        {q.explanation && (
          <details className="rounded-xl bg-blue-50/70 px-3 py-2 text-sm">
            <summary className="cursor-pointer text-xs font-bold text-brand-700">
              پاسخ تشریحی
            </summary>
            <div className="mt-2 leading-relaxed text-gray-700">
              <MathText text={q.explanation} />
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

/* ---------- کامپوننت اصلی ---------- */
export default function ReportCard({ report }) {
  const [answersOpen, setAnswersOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all | correct | wrong | blank

  const percentage = Math.round(report.percentage || 0);
  const grade = getGrade(percentage);

  const derived = useMemo(() => {
    const correct = report.correct ?? 0;
    const wrong   = report.wrong   ?? 0;
    const blank   = report.unanswered
      ?? Math.max((report.questions?.length || 0) - correct - wrong, 0);
    return { correct, wrong, blank };
  }, [report]);

  const items = useMemo(() => {
    if (!report.questions) return [];
    return report.questions.map((q, i) => {
      const selected = report.answers?.[i];
      const isCorrect =
        selected !== undefined &&
        selected !== null &&
        Number(selected) === Number(q.correctAnswer);
      const status =
        selected === undefined || selected === null
          ? 'blank'
          : isCorrect
          ? 'correct'
          : 'wrong';
      return { q, i, selected, status };
    });
  }, [report]);

  const filtered = items.filter((it) => filter === 'all' || it.status === filter);
  const topics = Object.entries(report.topics || {});

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition max-w:md hover:shadow-md">
      <div className={`h-1.5 bg-gradient-to-l ${grade.gradient}`} />

      {/* هدر */}
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 md:p-6">
        <div className="min-w-0">
          <h2 className="text-xl font-black text-brand-900 md:text-2xl">{report.examTitle}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar size={13} /> {new Date(report.createdAt).toLocaleString('fa-IR')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-l ${grade.gradient} px-3 py-1 text-xs font-bold text-white shadow-sm`}>
            <Sparkles size={12} /> {grade.label} {grade.emoji}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              report.autoSubmitted
                ? 'bg-amber-50 text-amber-700'
                : 'bg-blue-50 text-brand-700'
            }`}
          >
            {report.autoSubmitted ? 'تحویل خودکار' : 'تحویل دستی'}
          </span>
        </div>
      </div>

      {/* نمره + آمار */}
      <div className="grid gap-5 border-t border-gray-100 bg-gray-50/40 p-5 md:grid-cols-[auto_1fr] md:p-6">
        <div className="flex justify-center md:justify-start">
          <CircularProgress percent={percentage} color={grade.ring} />
        </div>
        <div className="flex flex-col justify-center space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <StatBox icon={<CheckCircle2 size={14} />} label="درست"    value={derived.correct} tone="emerald" />
            <StatBox icon={<XCircle size={14} />}      label="غلط"     value={derived.wrong}   tone="rose" />
            <StatBox icon={<MinusCircle size={14} />}  label="بی‌پاسخ" value={derived.blank}   tone="gray" />
          </div>
          <div className="space-y-1.5">
            <CompositionBar {...derived} />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1"><Target size={11} /> ترکیب پاسخ‌ها</span>
              <span className="flex items-center gap-1 tabular-nums">
                <Award size={11} /> {derived.correct} از {items.length} پاسخ صحیح
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* تحلیل مباحث */}
      {topics.length > 0 && (
        <section className="border-t border-gray-100 p-5 md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-brand-900">
            <BarChart3 size={16} /> تحلیل عملکرد مباحث
          </h3>
          <div className="space-y-4">
            {topics.map(([name, d]) => {
              const pct = d.total ? Math.round((d.correct / d.total) * 100) : 0;
              const tone = pct >= 70 ? 'emerald' : pct >= 40 ? 'amber' : 'rose';
              const bar  = { emerald: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500' }[tone];
              const text = { emerald: 'text-emerald-700', amber: 'text-amber-700', rose: 'text-rose-700' }[tone];
              return (
                <div key={name}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium text-gray-700">{name}</span>
                    <b className={`tabular-nums ${text}`}>
                      {pct}٪ <span className="text-xs font-normal text-gray-400">({d.correct} از {d.total})</span>
                    </b>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full transition-all ${bar}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* پاسخنامه */}
      <div className="border-t border-gray-100 p-5 md:p-6">
        <button
          onClick={() => setAnswersOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-2xl bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-100"
        >
          <span className="flex items-center gap-2">
            <ListChecks size={16} />
            {answersOpen ? 'بستن پاسخنامه' : 'مشاهده پاسخنامه'}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${answersOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {answersOpen && (
          <div className="mt-4 space-y-4">
            {/* فیلترها */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all',     label: 'همه',      count: items.length },
                { key: 'correct', label: 'درست',     count: derived.correct },
                { key: 'wrong',   label: 'غلط',      count: derived.wrong },
                { key: 'blank',   label: 'بی‌پاسخ',  count: derived.blank },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    filter === key
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} <span className="opacity-70">({count})</span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 p-8 text-center text-sm text-gray-500">
                <HelpCircle size={28} className="text-gray-300" />
                سؤالی با این فیلتر وجود ندارد.
              </div>
            ) : (
              filtered.map(({ q, i, selected, status }) => (
                <QuestionItem key={`${q.id}-${i}`} q={q} index={i} selected={selected} status={status} />
              ))
            )}
          </div>
        )}
      </div>
    </article>
  );
}