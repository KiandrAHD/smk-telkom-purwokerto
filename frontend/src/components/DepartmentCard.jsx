import { ArrowRight, Code2, Gamepad2, Network, RadioTower } from 'lucide-react';

const icons = {
  code: Code2,
  gamepad: Gamepad2,
  network: Network,
  tower: RadioTower,
};

const DepartmentCard = ({ icon, name, desc, image, href }) => {
  const Icon = icons[icon];

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card">
      <div className="relative">
        <img src={image} alt={name} className="w-full aspect-[2/1] object-cover" />
        <span className="absolute -bottom-4 left-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md">
          <Icon className="h-4 w-4 text-white" />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-3 pt-7">
        <h3 className="font-heading text-[13px] font-bold leading-snug text-dark-900">
          {name}
        </h3>
        <p className="mt-1.5 text-[10px] leading-relaxed text-dark-500">{desc}</p>
        <a
          href={href}
          className="mt-3 inline-flex items-center justify-between gap-2 text-[10px] font-bold text-primary hover:underline"
        >
          Selengkapnya
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
};

export default DepartmentCard;
