// // تبدیل قالب خروجی پرامپت: گزینه‌ها، pasookh و kilid
// export function parseExamText(raw) {
//   if (!raw?.trim()) throw new Error("متن خروجی خالی است.");
//   let text = raw.trim().replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "").trim();

//   const keyMatch = text.match(/(?:^|\n)\s*kilid:\s*([\s\S]*)$/i);
//   if (!keyMatch) throw new Error("بخش kilid: پیدا نشد.");
//   const keyLines = keyMatch[1].split(/\r?\n/).map(x => x.trim()).filter(Boolean);
//   const keys = keyLines.map(x => {
//     const n = Number(x.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
//     return Number.isInteger(n) && n >= 1 && n <= 4 ? n - 1 : null;
//   });
//   const body = text.slice(0, keyMatch.index).trim();
//   const blocks = body.split(/\n\s*---\s*\n/).map(x => x.trim()).filter(Boolean);

//   const questions = blocks.map((block, index) => {
//     const lines = block.split(/\r?\n/);
//     const answerIndex = lines.findIndex(line => /^pasookh:\s*$/i.test(line.trim()));
//     if (answerIndex < 0) throw new Error(`برچسب pasookh: در سؤال ${index + 1} پیدا نشد.`);
//     const questionAndOptions = lines.slice(0, answerIndex);
//     const optionRegex = /^\s*(\*)?گزینه\s*([۱-۴1-4])\)\s*(.*)$/;
//     const options = [];
//     let correctByStar = null;
//     const questionLines = [];
//     for (const line of questionAndOptions) {
//       const match = line.match(optionRegex);
//       if (match) {
//         const optionNumber = Number(match[2].replace(/[۱-۴]/g, d => "۱۲۳۴".indexOf(d) + 1));
//         options[optionNumber - 1] = match[3].trim();
//         if (match[1]) correctByStar = optionNumber - 1;
//       } else {
//         questionLines.push(line);
//       }
//     }
//     if (options.filter(x => x !== undefined).length !== 4) throw new Error(`سؤال ${index + 1} دقیقاً چهار گزینه ندارد.`);
//     const key = keys[index] ?? null;
//     if (key !== null && correctByStar !== null && key !== correctByStar) {
//       throw new Error(`کلید و ستاره سؤال ${index + 1} با هم تطابق ندارند.`);
//     }
//     return {
//       id: `Q-IMPORT-${Date.now().toString(36)}-${index + 1}`,
//       text: questionLines.join("\n").trim(),
//       options,
//       correctAnswer: key ?? correctByStar,
//       explanation: lines.slice(answerIndex + 1).join("\n").trim(),
//       olympiad: "", subject: "", chapter: "", topic: "",
//       source: "prompt-import",
//       hasKnownKey: key !== null || correctByStar !== null,
//     };
//   });

//   if (keys.length !== questions.length) {
//     throw new Error(`تعداد کلیدها (${keys.length}) با تعداد سؤال‌ها (${questions.length}) برابر نیست.`);
//   }
//   const missing = questions.map((q, i) => q.correctAnswer === null ? i + 1 : null).filter(Boolean);
//   return { questions, missingKeys: missing };
// }



const FA = "۰۱۲۳۴۵۶۷۸۹";
const AR = "٠١٢٣٤٥٦٧٨٩";

const toEn = (s = "") =>
  String(s).replace(/[۰-۹٠-٩]/g, (d) =>
    String(FA.includes(d) ? FA.indexOf(d) : AR.indexOf(d))
  );

const OPT_RE = /^(\*?)\s*گزینه\s*([۱-۵1-5])\s*\)\s*(.*)$/;
const SHORT_RE = /^short\s*:\s*(.*)$/i;
const PAS_RE = /^pasookh\s*:\s*(.*)$/i;

function parseBlock(block, index, warnings) {
  let mode = "text"; // text | opt | short | expl
  const text = [];
  const opts = [];
  const expl = [];
  let star = null;
  let shortRaw = null;

  for (const line of block.split("\n")) {
    const t = line.trim();

    if (mode !== "expl") {
      const pm = t.match(PAS_RE);
      if (pm) {
        mode = "expl";
        if (pm[1]) expl.push(pm[1]);
        continue;
      }
    }
    if (mode === "expl") {
      expl.push(line);
      continue;
    }

    const om = t.match(OPT_RE);
    if (om) {
      mode = "opt";
      opts.push(om[3].trim());
      if (om[1] === "*") star = opts.length - 1;
      continue;
    }

    const sm = t.match(SHORT_RE);
    if (sm) {
      mode = "short";
      shortRaw = sm[1];
      continue;
    }

    if (!t) {
      if (mode === "text") text.push("");
      continue;
    }

    if (mode === "opt") opts[opts.length - 1] += " " + t; // ادامه‌ی گزینه
    else if (mode === "short") continue;
    else text.push(line);
  }

  const isShort = shortRaw !== null && opts.length === 0;
  let fallback = null;

  if (isShort) {
    const digits = toEn(shortRaw).replace(/\D/g, "");
    if (digits !== "") {
      const n = parseInt(digits, 10);
      if (n >= 0 && n <= 9999) fallback = n;
      else warnings.push(`سؤال ${index + 1}: پاسخ کوتاه خارج از بازه‌ی ۰ تا ۹۹۹۹ است.`);
    }
  } else {
    if (opts.length < 4 || opts.length > 5)
      warnings.push(
        `سؤال ${index + 1}: تعداد گزینه‌ها ${opts.length} است (۴ یا ۵ انتظار می‌رفت).`
      );
    fallback = star;
  }

  return {
    id: `q${index + 1}`,
    type: isShort ? "short" : "mcq",
    text: text.join("\n").trim(),
    options: opts,
    correctAnswer: fallback, // اگر kilid موجود باشد بعداً جایگزین می‌شود
    explanation: expl.join("\n").trim(),
  };
}

export function parseExamText(raw) {
  const text = String(raw || "")
    .replace(/\r/g, "")
    .replace(/^```.*$/gm, "")
    .trim();
  if (!text) throw new Error("متن خالی است.");

  const km = /^[ \t]*kilid[ \t]*:/im.exec(text);
  const body = km ? text.slice(0, km.index) : text;
  const keyPart = km ? text.slice(km.index + km[0].length) : "";
  const keys = keyPart
    .split("\n")
    .map((s) => toEn(s).trim())
    .filter(Boolean);

  const warnings = [];
  const blocks = body
    .split(/^\s*---\s*$/m)
    .map((b) => b.trim())
    .filter(Boolean);
  if (!blocks.length) throw new Error("هیچ سؤالی پیدا نشد.");

  const questions = blocks.map((b, i) => parseBlock(b, i, warnings));

  if (!km) {
    warnings.push("بخش kilid: پیدا نشد؛ فقط از ستاره‌ها و short استفاده شد.");
  } else if (keys.length !== questions.length) {
    warnings.push(
      `تعداد خطوط kilid (${keys.length}) با تعداد سؤال‌ها (${questions.length}) برابر نیست؛ کلیدها ممکن است جابه‌جا شده باشند.`
    );
  }

  questions.forEach((q, i) => {
    const tok = /^\d+$/.test(keys[i] || "") ? parseInt(keys[i], 10) : null;
    if (tok === null) return; // «-» یا خط ناموجود: همان مقدار ستاره/short می‌ماند

    let val = null;
    if (q.type === "short") val = tok <= 9999 ? tok : null;
    else val = tok >= 1 && tok <= q.options.length ? tok - 1 : null;

    if (val === null) {
      warnings.push(`سؤال ${i + 1}: مقدار kilid (${keys[i]}) معتبر نیست.`);
      return;
    }
    if (q.correctAnswer !== null && val !== q.correctAnswer)
      warnings.push(`سؤال ${i + 1}: کلید با ستاره/short هماهنگ نیست؛ kilid ملاک قرار گرفت.`);
    q.correctAnswer = val;
  });

  const missingKeys = questions
    .map((q, i) => (q.correctAnswer === null ? i + 1 : null))
    .filter((x) => x !== null);

  return { questions, missingKeys, warnings };
}