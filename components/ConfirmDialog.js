'use client';

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-brand-900">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-outline text-sm"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn text-sm"
            style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}
          >
            {loading ? 'در حال حذف…' : 'حذف'}
          </button>
        </div>
      </div>
    </div>
  );
}