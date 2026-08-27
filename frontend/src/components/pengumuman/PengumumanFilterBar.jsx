import { Search } from 'lucide-react';
import { pengumumanFilter } from '../../data/dummyData';

const PengumumanFilterBar = ({ chip, onChip, query, onQuery }) => (
  <div className="flex flex-wrap items-center gap-2">
    {pengumumanFilter.chips.map((c) => (
      <button
        key={c}
        type="button"
        onClick={() => onChip(c)}
        aria-pressed={chip === c}
        className={`min-w-[62px] rounded-lg px-3 py-2 text-[11px] font-bold transition-colors ${
          chip === c
            ? 'bg-primary text-white'
            : 'border border-dark-300 text-dark-900/[0.68] hover:border-primary hover:text-primary'
        }`}
      >
        {c}
      </button>
    ))}

    <label className="relative ml-auto">
      <span className="sr-only">{pengumumanFilter.searchPlaceholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dark-900/[0.68]" />
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={pengumumanFilter.searchPlaceholder}
        className="w-[150px] rounded-lg border border-dark-300 py-2 pl-8 pr-3 text-[11px] font-bold text-dark-900 outline-none transition-colors placeholder:text-dark-900/[0.68] focus:border-primary"
      />
    </label>
  </div>
);

export default PengumumanFilterBar;
