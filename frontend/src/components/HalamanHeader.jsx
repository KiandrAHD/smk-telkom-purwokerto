// Kepala halaman untuk halaman pelengkap: label kecil, judul, deskripsi.
// Bentuknya sama dengan hero section halaman publik lain (Prestasi, Jurusan,
// Berita) supaya halaman baru tidak terasa datang dari sistem yang berbeda.
const HalamanHeader = ({ eyebrow, title, deskripsi, aksi }) => (
  <section className="bg-dark-50 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
    <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-3 font-heading text-3xl font-extrabold text-dark-900 sm:text-4xl">
          {title}
        </h1>
        {deskripsi && (
          <p className="mt-4 text-sm leading-relaxed text-dark-600 sm:text-base">{deskripsi}</p>
        )}
      </div>
      {aksi}
    </div>
  </section>
);

export default HalamanHeader;
