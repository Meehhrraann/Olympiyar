import Link from "next/link";

export default function FeatureCard({ title, description, image, href }) {
  return (
    <Link href={href} className="card group overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-48 overflow-hidden bg-blue-50">
        <img src={image} alt={title} className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"  />
      </div>
      <div className="p-5">
        <h2 className="text-xl font-black text-brand-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <span className="mt-5 inline-flex font-bold text-brand-500">ورود به بخش ←</span>
      </div>
    </Link>
  );
}
