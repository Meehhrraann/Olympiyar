import Image from 'next/image';

export default function InPersonPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="section-title mb-6">آزمون حضوری درون‌شهری</h1>

      <div className="card overflow-hidden p-0 grid md:grid-cols-2">
        {/* متن — سمت راست در RTL */}
        <div className="order-2 md:order-1 space-y-3 p-6">
          <h2 className="text-2xl font-black text-brand-900">
            اطلاعات آزمون حضوری
          </h2>
          <p className="text-gray-600">
            اطلاعات زیر نمونه است و باید با اطلاعات واقعی رویداد جایگزین شود.
          </p>
          <div className="rounded-xl bg-gray-50 p-4 space-y-1">
            <p><b>آدرس:</b> تهران، محل برگزاری متعاقباً اعلام می‌شود.</p>
            <p><b>تاریخ:</b> متعاقباً اعلام می‌شود.</p>
            <p><b>ساعت:</b> متعاقباً اعلام می‌شود.</p>
          </div>
        </div>

        {/* تصویر — چپ، کانتینر با نسبت 4:3 = نسبت تصویر */}
<div className="order-1 md:order-2 flex items-center justify-center bg-gray-50 p-2">
  <Image
    src="/hozori.png"
    alt="آزمون حضوری"
    width={800}
    height={600}
    className="h-auto w-full max-w-sm object-contain"
    priority
  />
</div>
      </div>
    </div>
  );
}