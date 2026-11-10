// تبدیل قالب خروجی پرامپت: گزینه‌ها، pasookh و kilid
export function parseExamText(raw) {
  if (!raw?.trim()) throw new Error("متن خروجی خالی است.");
  let text = raw.trim().replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "").trim();

  const keyMatch = text.match(/(?:^|\n)\s*kilid:\s*([\s\S]*)$/i);
  if (!keyMatch) throw new Error("بخش kilid: پیدا نشد.");
  const keyLines = keyMatch[1].split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const keys = keyLines.map(x => {
    const n = Number(x.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
    return Number.isInteger(n) && n >= 1 && n <= 4 ? n - 1 : null;
  });
  const body = text.slice(0, keyMatch.index).trim();
  const blocks = body.split(/\n\s*---\s*\n/).map(x => x.trim()).filter(Boolean);

  const questions = blocks.map((block, index) => {
    const lines = block.split(/\r?\n/);
    const answerIndex = lines.findIndex(line => /^pasookh:\s*$/i.test(line.trim()));
    if (answerIndex < 0) throw new Error(`برچسب pasookh: در سؤال ${index + 1} پیدا نشد.`);
    const questionAndOptions = lines.slice(0, answerIndex);
    const optionRegex = /^\s*(\*)?گزینه\s*([۱-۴1-4])\)\s*(.*)$/;
    const options = [];
    let correctByStar = null;
    const questionLines = [];
    for (const line of questionAndOptions) {
      const match = line.match(optionRegex);
      if (match) {
        const optionNumber = Number(match[2].replace(/[۱-۴]/g, d => "۱۲۳۴".indexOf(d) + 1));
        options[optionNumber - 1] = match[3].trim();
        if (match[1]) correctByStar = optionNumber - 1;
      } else {
        questionLines.push(line);
      }
    }
    if (options.filter(x => x !== undefined).length !== 4) throw new Error(`سؤال ${index + 1} دقیقاً چهار گزینه ندارد.`);
    const key = keys[index] ?? null;
    if (key !== null && correctByStar !== null && key !== correctByStar) {
      throw new Error(`کلید و ستاره سؤال ${index + 1} با هم تطابق ندارند.`);
    }
    return {
      id: `Q-IMPORT-${Date.now().toString(36)}-${index + 1}`,
      text: questionLines.join("\n").trim(),
      options,
      correctAnswer: key ?? correctByStar,
      explanation: lines.slice(answerIndex + 1).join("\n").trim(),
      olympiad: "", subject: "", chapter: "", topic: "",
      source: "prompt-import",
      hasKnownKey: key !== null || correctByStar !== null,
    };
  });

  if (keys.length !== questions.length) {
    throw new Error(`تعداد کلیدها (${keys.length}) با تعداد سؤال‌ها (${questions.length}) برابر نیست.`);
  }
  const missing = questions.map((q, i) => q.correctAnswer === null ? i + 1 : null).filter(Boolean);
  return { questions, missingKeys: missing };
}
