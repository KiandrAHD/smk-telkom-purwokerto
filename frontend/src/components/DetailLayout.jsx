import { ArrowLeft, CalendarDays, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Tampilan bersama untuk semua halaman detail. Komponen ini sengaja tidak tahu
// kategori apa pun: seluruh isinya datang dari objek `item` yang dicari lewat
// slug di halaman detail masing-masing, jadi tidak ada teks yang dipaku di sini.
const DetailLayout = ({ item, backTo, backLabel, children }) => (
  <MainLayout>
    <article className="bg-white py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-primary">
          <Link to="/" className="hover:underline">
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={backTo} className="hover:underline">
            {backLabel}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-dark-500">{item.title}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded bg-primary-50 px-2.5 py-1 text-[10px] font-bold text-primary">
            {item.kategori}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-dark-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {item.date}
          </span>
          {item.author && <span className="text-[11px] text-dark-500">{item.author}</span>}
        </div>

        <h1 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold leading-tight text-dark-900">
          {item.title}
        </h1>
        {item.subtitle && (
          <p className="mt-2 text-sm font-semibold text-primary">{item.subtitle}</p>
        )}

        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="mt-7 w-full rounded-2xl object-cover aspect-[16/9]"
          />
        )}

        <p className="mt-7 text-sm sm:text-base font-medium leading-relaxed text-dark-700">
          {item.lead}
        </p>

        <div className="mt-5 space-y-4">
          {item.body.map((paragraf) => (
            <p key={paragraf} className="text-xs sm:text-sm leading-relaxed text-dark-500">
              {paragraf}
            </p>
          ))}
        </div>

        {item.facts && (
          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-dark-100 bg-dark-100 sm:grid-cols-2">
            {item.facts.map((fakta) => (
              <div key={fakta.label} className="bg-white px-5 py-4">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-dark-400">
                  {fakta.label}
                </dt>
                <dd className="mt-1 font-heading text-xs font-bold text-dark-900">
                  {fakta.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {children}

        <Link
          to={backTo}
          className="mt-9 inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-6 py-3 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke {backLabel}
        </Link>
      </div>
    </article>
  </MainLayout>
);

export default DetailLayout;
