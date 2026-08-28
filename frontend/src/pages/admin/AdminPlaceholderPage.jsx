const AdminPlaceholderPage = ({ title }) => (
  <section>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel Admin</p>
    <h1 className="mt-2 font-heading text-2xl font-extrabold text-dark-900">{title}</h1>
    <div className="mt-6 rounded-2xl border border-dashed border-dark-300 bg-white p-8 text-center shadow-card">
      <p className="text-sm text-dark-500">Fitur ini akan tersedia pada tahap CRUD berikutnya.</p>
    </div>
  </section>
);

export default AdminPlaceholderPage;

