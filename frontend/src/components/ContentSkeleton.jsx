export default function ContentSkeleton({ carousel = false }) {
  return (
    <div aria-hidden="true" className="grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={`overflow-hidden rounded-xl border border-dark-100 motion-safe:animate-pulse ${carousel && index > 0 ? index === 1 ? 'hidden sm:block' : 'hidden lg:block' : ''}`}>
          <div className={`${carousel ? 'aspect-[16/9]' : 'aspect-[16/10]'} bg-dark-100`} />
          <div className="space-y-3 p-4">
            <div className="h-4 w-4/5 rounded bg-dark-100" />
            <div className="h-3 w-1/2 rounded bg-dark-100" />
            <div className="h-3 rounded bg-dark-100" />
            <div className="h-3 w-3/4 rounded bg-dark-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
