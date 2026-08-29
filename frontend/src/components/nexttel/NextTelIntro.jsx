import { ArrowRight, Compass } from 'lucide-react';

const NextTelIntro = ({ onStart }) => (
  <div className="rounded-3xl bg-primary px-6 py-10 text-white shadow-card sm:px-10 sm:py-14">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
      <Compass className="h-7 w-7" aria-hidden="true" />
    </div>
    <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-white/70">NextTel AI</p>
    <h1 className="mt-2 max-w-2xl font-heading text-3xl font-extrabold leading-tight sm:text-5xl">
      Temukan jurusan yang cocok dengan minatmu
    </h1>
    <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
      Jawab 8 pertanyaan singkat tentang hal yang kamu sukai. NextTel akan membantu
      membaca kecenderungan minatmu pada jurusan teknologi di SMK Telkom Purwokerto.
    </p>
    <button
      type="button"
      onClick={onStart}
      className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary-50"
    >
      Mulai sekarang
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
);

export default NextTelIntro;
