import FeatureCard from "@/components/FeatureCard";
export default function CreatePage() {
  return <div className="mx-auto max-w-7xl px-4 py-6">
    <h1 className="section-title">آزمون‌ساز المپیار</h1>
    <p className="mb-8 mt-2 text-gray-500">روش طراحی آزمون را انتخاب کنید.</p>
    <div className="grid gap-6 md:grid-cols-3">
      <FeatureCard title="ساخت آزمون دستی" description="طراحی سؤال با فرمول‌نویسی، پاسخ تشریحی و تعیین گزینه صحیح." image="/creator-manual.png" href="/create/manual" />
      <FeatureCard title="ورود آزمون با قالب هوشمند" description="Paste کردن خروجی ChatGPT و تبدیل خودکار آن به آزمون." image="/creator-ai.png" href="/create/ai" />
      <FeatureCard title="ساخت آزمون از بانک" description="جست‌وجو و انتخاب سؤال‌های بانک و تعیین زمان آزمون." image="/creator-bank.png" href="/create/bank" />
    </div>
  </div>;
}
