const PublicDataState = ({ loading, error, empty, label }) => {
  if (loading) {
    return <p className="py-8 text-center text-xs text-dark-500">Memuat {label}...</p>;
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs text-red-700">
        {error}
      </p>
    );
  }

  if (empty) {
    return <p className="py-8 text-center text-xs text-dark-500">Belum ada {label}.</p>;
  }

  return null;
};

export default PublicDataState;
