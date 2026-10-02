import accent from '../assets/landing/figma-section-accent.png';

// Dekorasi hanya tampil ketika gutter cukup lebar untuk tidak menabrak konten.
export default function SectionAccents({ variant }) {
  const sides = ['departments', 'schoolTeachers', 'activities'].includes(variant) ? ['left-2', 'right-2'] : [variant === 'teachers' ? 'left-2' : 'right-2'];
  return (
    <div aria-hidden="true" data-accent-section={variant} className={`pointer-events-none absolute inset-0 hidden overflow-hidden min-[1440px]:block ${variant === 'schoolTeachers' ? 'min-[1660px]:hidden min-[1800px]:block' : ''}`}>
      {sides.map((side) => (
        <div key={side} className={`absolute top-1/2 flex -translate-y-1/2 flex-col gap-4 ${side}`}>
          {[0, 1, 2].map((index) => <img key={index} src={accent} alt="" className="size-16 select-none" />)}
        </div>
      ))}
    </div>
  );
}
