import { X } from 'lucide-react';

const PrestasiModal = ({ title, onClose, children, size = 'max-w-2xl' }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/50 p-4"
    role="presentation"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <div
      className={`max-h-[90vh] w-full ${size} overflow-y-auto rounded-2xl bg-white shadow-2xl`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prestasi-modal-title"
    >
      <div className="flex items-center justify-between border-b border-dark-100 px-5 py-4 sm:px-6">
        <h2 id="prestasi-modal-title" className="font-heading text-lg font-extrabold text-dark-900">{title}</h2>
        <button type="button" onClick={onClose} className="rounded-lg p-2 text-dark-400 transition-colors hover:bg-dark-50 hover:text-dark-700" aria-label="Tutup modal">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  </div>
);

export default PrestasiModal;

