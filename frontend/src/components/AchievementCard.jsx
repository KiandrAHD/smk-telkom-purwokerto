const AchievementCard = ({ title, category, image, highlight = false }) => (
  <article
    className={`overflow-hidden rounded-2xl border bg-white shadow-card ${
      highlight ? 'border-primary' : 'border-dark-100'
    }`}
  >
    <img src={image} alt={title} className="w-full aspect-[16/9] object-cover" />
    <div className="px-4 py-2.5">
      <h3 className="whitespace-pre-line font-heading text-sm font-bold leading-snug text-dark-900">
        {title}
      </h3>
      <p className="mt-1 text-[10px] text-dark-500">{category}</p>
    </div>
  </article>
);

export default AchievementCard;
