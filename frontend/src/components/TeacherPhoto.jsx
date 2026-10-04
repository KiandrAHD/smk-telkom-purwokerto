// Crop lama memakai framing CSS; foto baru sudah dipotong 4:5 dari ZIP asli.
const TeacherPhoto = ({ teacher, alt, loading = 'lazy', className = '' }) => (
  <div className={`relative aspect-[4/5] overflow-hidden rounded-xl bg-dark-50 ${className}`}>
    <img
      src={teacher.image}
      srcSet={teacher.imageSrcSet}
      sizes={teacher.imageSrcSet ? teacher.imageSizes || '(min-width: 1280px) 240px, (min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw' : undefined}
      width={teacher.imageWidth}
      height={teacher.imageHeight}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`absolute h-auto max-w-none ${teacher.photoCropClassName}`}
    />
  </div>
);

export default TeacherPhoto;
