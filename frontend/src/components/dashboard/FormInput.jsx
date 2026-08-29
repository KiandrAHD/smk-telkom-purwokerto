import { useId } from 'react';

// Satu komponen untuk input, select, dan textarea. Label, jarak, dan gaya fokus
// jadi seragam di seluruh form admin, dan id-nya dibuat otomatis lewat useId
// sehingga <label htmlFor> selalu benar tanpa perlu diberi id manual.
const FormInput = ({
  label,
  as = 'input',
  options,
  wajib = false,
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  const id = useId();
  const gaya =
    'w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-xs text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary focus:ring-4 focus:ring-primary/10';

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-[11px] font-bold text-dark-700">
          {label}
          {wajib && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}

      {as === 'select' ? (
        <select id={id} className={`${gaya} ${className}`} {...props}>
          {options?.map((opsi) =>
            typeof opsi === 'string' ? (
              <option key={opsi} value={opsi}>
                {opsi}
              </option>
            ) : (
              <option key={opsi.value} value={opsi.value}>
                {opsi.label}
              </option>
            )
          )}
        </select>
      ) : as === 'textarea' ? (
        <textarea id={id} className={`${gaya} resize-y ${className}`} {...props} />
      ) : (
        <input id={id} className={`${gaya} ${className}`} {...props} />
      )}
    </div>
  );
};

export default FormInput;
