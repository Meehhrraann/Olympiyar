import FeatureCard from "@/components/FeatureCard";
export default function ExamPage() {
  return <div className="mx-auto max-w-7xl px-16 py-7">
    <h1 className="section-title">آزمون‌های المپیار</h1>
    <p className="mb-8 mt-2 text-gray-500">نوع آزمون را انتخاب کنید.</p>
    <div className="grid gap-6 md:grid-cols-2">
      <FeatureCard title="آزمون حضوری درون‌شهری" description="مشاهده محل، تاریخ و ساعت برگزاری آزمون." image="/hozori.png" href="/exam/in-person"/>
      <FeatureCard title="آزمون آنلاین" description="شرکت در آزمون‌های ساخته‌شده و دریافت کارنامه." image="/online.png" href="/exam/online"/>
    </div>
  </div>;
}
