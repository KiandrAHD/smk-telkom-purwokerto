// Crop hanya mengatur framing; berkas foto asli dan wajah tetap utuh.
const TeacherPhoto = ({ teacher, alt, loading = 'lazy', className = '' }) => (
  <div className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-dark-50 ${className}`}>
    <img
      src={teacher.image}
      alt={alt}
      loading={loading}
      className={`absolute h-auto max-w-none ${teacher.photoCropClassName}`}
    />
  </div>
);

export default TeacherPhoto;
