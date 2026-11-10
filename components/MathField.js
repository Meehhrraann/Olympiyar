"use client";

import { useEffect, useRef, useState } from "react";

export default function MathField({ onInsert }) {
  const fieldRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    import("mathlive").then(() => {
      if (active) setReady(true);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  function insert() {
    const latex = fieldRef.current?.value?.trim();
    if (!latex) return;
    onInsert?.(latex);
    fieldRef.current.value = "";
  }

  return (
    <div className="rounded-xl border border-border bg-gray-50 p-3">
      <label className="mb-2 block text-sm font-bold text-brand-900">فرمول‌نویسی با MathLive</label>
      {ready ? <math-field ref={fieldRef} virtual-keyboard-mode="manual" placeholder="فرمول را اینجا بنویسید..." /> :
        <div className="rounded-lg bg-white p-3 text-sm text-gray-500">در حال بارگذاری ویرایشگر فرمول…</div>}
      <button type="button" className="btn btn-outline mt-3 w-full" onClick={insert} disabled={!ready}>افزودن فرمول به انتهای متن</button>
      <p className="mt-2 text-xs text-gray-500">فرمول به متن به شکل LaTeX درون‌خطی اضافه می‌شود؛ برای ویرایش متن فارسی از کادر متن استفاده کنید.</p>
    </div>
  );
}
