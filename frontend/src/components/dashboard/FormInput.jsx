import { useId } from 'react';
import { useLanguage } from '../../context/LanguageContext';

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
  error = '',
  ...props
}) => {
  const { t } = useLanguage();
  const id = useId();
  const gaya = `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-dark-900 outline-none transition-colors placeholder:text-dark-400 focus:border-primary ${error ? 'border-red-500' : 'border-dark-200'}`;
  const accessibility = error ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {};

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-dark-700">
          {t(label)}
          {wajib && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}

      {as === 'select' ? (
        <select id={id} className={`${gaya} ${className}`} {...accessibility} {...props}>
          {options?.map((opsi) =>
            typeof opsi === 'string' ? (
              <option key={opsi} value={opsi}>
                {t(opsi)}
              </option>
            ) : (
              <option key={opsi.value} value={opsi.value}>
                {t(opsi.label)}
              </option>
            )
          )}
        </select>
      ) : as === 'textarea' ? (
        <textarea id={id} className={`${gaya} resize-y ${className}`} {...accessibility} {...props} />
      ) : (
        <input id={id} className={`${gaya} ${className}`} {...accessibility} {...props} />
      )}
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-700">{error}</p>}
    </div>
  );
};

export default FormInput;
