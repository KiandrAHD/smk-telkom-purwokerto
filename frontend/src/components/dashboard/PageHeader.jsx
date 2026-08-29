import { Link } from 'react-router-dom';

// Judul halaman + breadcrumb + satu tombol aksi di kanan. Bentuk ini berulang di
// setiap halaman manajemen, jadi disatukan supaya ukuran judul dan jarak
// breadcrumb tidak berbeda-beda antar halaman.
const PageHeader = ({ judul, breadcrumb = [], aksi }) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl">{judul}</h1>

      <nav aria-label="Breadcrumb" className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
        {breadcrumb.map((item, i) => (
          <span key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-dark-300">/</span>}
            {item.to ? (
              <Link to={item.to} className="text-dark-500 transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-dark-500">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>

    {aksi}
  </div>
);

export default PageHeader;
