import { useState } from "react";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
  agendaEvent,
  galeriKegiatan,
  newsletterBerita,
} from "../../data/dummyData";
import { slugify } from "../../utils/slug";

const BeritaAgendaSection = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setEmail("");
  };

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Agenda event */}
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-sm font-extrabold text-dark-900">
              {agendaEvent.title}
            </h2>
            <Link
              to="/berita/agenda"
              className="text-[10px] font-bold text-primary hover:underline"
            >
              {agendaEvent.linkText}
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {agendaEvent.items.map((ev) => (
              <li key={ev.title}>
                <Link
                  to={`/berita/agenda/${slugify(ev.title)}`}
                  className="flex items-center gap-3 rounded-xl border border-dark-100 px-3 py-2.5 transition-colors hover:border-primary"
                >
                  <span className="flex w-9 flex-shrink-0 flex-col items-center">
                    <span className="font-heading text-base font-extrabold leading-none text-primary">
                      {ev.day}
                    </span>
                    <span className="text-[8px] text-primary">{ev.month}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-heading text-[10px] font-bold leading-snug text-dark-900">
                      {ev.title}
                    </span>
                    <span className="block text-[8px] text-dark-400">
                      {ev.venue}
                    </span>
                  </span>
                  <span className="flex-shrink-0 rounded bg-primary-50 px-2 py-1 text-[8px] font-bold text-primary">
                    {ev.tag}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to="/berita/agenda"
            className="mt-4 inline-block text-[10px] font-bold text-primary hover:underline"
          >
            {agendaEvent.ctaText}
          </Link>
        </div>

        {/* Galeri kegiatan */}
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-sm font-extrabold text-dark-900">
              {galeriKegiatan.title}
            </h2>
            <Link
              to="/galeri"
              className="text-[10px] font-bold text-primary hover:underline"
            >
              {galeriKegiatan.linkText}
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {galeriKegiatan.items.map((g) => (
              <Link
                key={g.alt}
                to={`/galeri/${slugify(g.alt)}`}
                className="block overflow-hidden rounded-lg"
              >
                <img
                  src={g.image}
                  alt={g.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg object-cover transition-transform hover:scale-[1.03]"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Langganan newsletter */}
        <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2.5">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-sm font-extrabold text-dark-900">
              {newsletterBerita.title}
            </h2>
          </div>

          <h3 className="mt-4 font-heading text-base font-extrabold text-dark-900">
            {newsletterBerita.heading}
          </h3>
          <p className="mt-2 text-[9px] leading-relaxed text-dark-500">
            {newsletterBerita.description}
          </p>

          <form onSubmit={submit} className="mt-4">
            <label>
              <span className="sr-only">{newsletterBerita.placeholder}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSent(false);
                }}
                placeholder={newsletterBerita.placeholder}
                className="w-full rounded-lg border border-dark-200 px-3 py-2.5 text-[10px] text-dark-700 outline-none transition-colors placeholder:text-dark-400 focus:border-primary"
              />
            </label>
            <button
              type="submit"
              className="mt-3 w-full rounded-lg bg-primary py-2.5 text-[11px] font-bold text-white transition-colors hover:bg-primary-800"
            >
              {newsletterBerita.ctaText}
            </button>
          </form>

          <p
            aria-live="polite"
            className="mt-3 text-[8px] leading-relaxed text-dark-400"
          >
            {sent ? (
              <span className="font-semibold text-primary">
                {newsletterBerita.successText}
              </span>
            ) : (
              newsletterBerita.note
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeritaAgendaSection;
