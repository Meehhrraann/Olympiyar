// app/exam/[id]/page.js
import { Suspense } from "react";
import ExamTaker from "@/components/ExamTaker";

export default async function ExamDetailPage({ params }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  return (
    <Suspense fallback={<ExamLoading />}>
      <ExamTaker examId={decodedId} />
    </Suspense>
  );
}

function ExamLoading() {
  return (
    <div className="mx-auto max-w-3xl p-12 text-center">
      در حال آماده‌سازی آزمون…
    </div>
  );
}