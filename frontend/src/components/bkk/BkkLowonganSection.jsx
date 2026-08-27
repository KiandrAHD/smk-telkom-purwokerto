import { useMemo, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bkkSearch, lowonganPopuler } from '../../data/dummyData';
import { slugify } from '../../utils/slug';

const Select = ({ label, value, onChange, options }) => (
  <label className="min-w-0 flex-1">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-dark-200 bg-white px-3 py-2.5 text-[11px] outline-none transition-colors focus:border-primary ${
        value ? 'text-dark-700' : 'text-dark-400'
      }`}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </label>
);

const BkkLowonganSection = () => {
  const [keyword, setKeyword] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kategori, setKategori] = useState('');
  const [tipe, setTipe] = useState('');
  const [chip, setChip] = useState('Semua');

  const shown = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return lowonganPopuler.items.filter((job) => {
      const byText =
        !q ||
        job.role.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));
      const byLokasi = !lokasi || job.location.includes(lokasi);
      const byKategori = !kategori || job.tags.includes(kategori);
      const byTipe = !tipe || job.badges.includes(tipe);
      const byChip = chip === 'Semua' || job.tags.includes(chip);
      return byText && byLokasi && byKategori && byTipe && byChip;
    });
  }, [keyword, lokasi, kategori, tipe, chip]);

  const reset = () => {
    setKeyword('');
    setLokasi('');
    setKategori('');
    setTipe('');
    setChip('Semua');
  };

  return (
    <section id="lowongan" className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Panel pencarian */}
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card sm:p-6">
          <h2 className="font-heading text-lg sm:text-xl font-extrabold text-dark-900">
            {bkkSearch.title} <span className="text-primary">{bkkSearch.titleAccent}</span>{' '}
            {bkkSearch.titleTail}
          </h2>

          <div className="mt-4 flex flex-col gap-2.5 lg:flex-row lg:items-center">
            <label className="min-w-0 flex-[2]">
              <span className="sr-only">{bkkSearch.placeholders.keyword}</span>
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={bkkSearch.placeholders.keyword}
                className="w-full rounded-lg border border-dark-200 px-3 py-2.5 text-[11px] text-dark-700 outline-none transition-colors placeholder:text-dark-400 focus:border-primary"
              />
            </label>
            <Select label={bkkSearch.placeholders.lokasi} value={lokasi} onChange={setLokasi} options={bkkSearch.lokasiOptions} />
            <Select label={bkkSearch.placeholders.kategori} value={kategori} onChange={setKategori} options={bkkSearch.kategoriOptions} />
            <Select label={bkkSearch.placeholders.tipe} value={tipe} onChange={setTipe} options={bkkSearch.tipeOptions} />
            <button
              type="button"
              onClick={reset}
              className="flex-shrink-0 rounded-lg bg-primary px-6 py-2.5 text-[11px] font-bold text-white transition-colors hover:bg-primary-800"
            >
              {bkkSearch.ctaText}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {bkkSearch.chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChip(c)}
                aria-pressed={chip === c}
                className={`rounded-full border px-3.5 py-1.5 text-[10px] font-semibold transition-colors ${
                  chip === c
                    ? 'border-primary bg-primary text-white'
                    : 'border-dark-200 bg-white text-dark-600 hover:border-primary hover:text-primary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Lowongan populer */}
        <h2 className="mt-9 font-heading text-xl sm:text-2xl font-extrabold text-dark-900">
          {lowonganPopuler.title}
        </h2>

        {shown.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((job) => (
              <article
                key={job.role}
                className="flex flex-col rounded-2xl border border-dark-100 bg-white p-4 shadow-card transition-transform hover:-translate-y-1"
              >
                <img
                  src={job.logo}
                  alt={job.company}
                  className="h-8 w-auto max-w-[7rem] self-start object-contain"
                />
                <h3 className="mt-4 font-heading text-sm font-bold text-dark-900">{job.role}</h3>
                <p className="mt-1 text-[10px] text-dark-500">{job.company}</p>
                <p className="mt-1.5 flex items-center gap-1 text-[10px] text-dark-500">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {job.location}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {job.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded border border-dark-200 px-2 py-1 text-[9px] font-semibold text-dark-600"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-[11px] font-bold text-primary">{job.salary}</p>

                <Link
                  to={`/bkk/lowongan/${slugify(`${job.role} ${job.company}`)}`}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-dark-200 px-3 py-2 text-[9px] font-bold text-dark-600 transition-colors hover:border-primary hover:text-primary"
                >
                  {lowonganPopuler.ctaText}
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-xs text-dark-500">
            Tidak ada lowongan yang cocok. Coba ubah filter atau tekan “{bkkSearch.ctaText}”.
          </p>
        )}
      </div>
    </section>
  );
};

export default BkkLowonganSection;
