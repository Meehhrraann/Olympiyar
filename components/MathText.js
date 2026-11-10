"use client";

import { useEffect, useRef } from "react";

function MathPart({ latex, display = false }) {
  const ref = useRef(null);
  useEffect(() => {
    let live = true;
    import("mathlive").then(() => {
      if (!live || !ref.current) return;
      ref.current.value = latex;
      ref.current.readOnly = true;
      ref.current.setAttribute("read-only", "");
    });
    return () => { live = false; };
  }, [latex]);
  return <span className={display ? "my-2 block overflow-x-auto text-center" : "inline-block align-middle"}><math-field ref={ref} read-only className={display ? "mx-auto" : "inline-block"} /></span>;
}

export default function MathText({ text = "" }) {
  const parts = [];
  const regex = /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g;
  let last = 0, match, index = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({ type: "text", value: text.slice(last, match.index), key: index++ });
    parts.push({ type: "math", value: match[1] ?? match[2], display: Boolean(match[2]), key: index++ });
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last), key: index++ });
  return <span className="whitespace-pre-wrap">{parts.map(part => part.type === "text" ? <span key={part.key}>{part.value}</span> : <MathPart key={part.key} latex={part.value} display={part.display} />)}</span>;
}
