import { pengumumanFilter } from '../../data/dummyData';

const PengumumanFilterBar = ({ chip, onChip, query, onQuery }) => (
  <div className="flex flex-wrap items-center gap-2">
    {pengumumanFilter.chips.map((c) => (
      <button
        key={c}
        type="button"
        onClick={() => onChip(c)}
        aria-pressed={chip === c}
        className={`min-w-[92px] rounded-lg px-3 py-[15px] text-xl font-bold transition-colors ${
          chip === c
            ? 'bg-primary text-white'
            : 'border border-dark-300 text-dark-900/[0.68] hover:border-primary hover:text-primary'
        }`}
      >
        {c}
      </button>
    ))}

    <label className="ml-auto">
      <span className="sr-only">{pengumumanFilter.searchPlaceholder}</span>
      <input
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder={pengumumanFilter.searchPlaceholder}
        className="w-[209px] rounded-lg border border-dark-300 px-4 py-[17px] text-[17px] font-bold text-dark-900 outline-none transition-colors placeholder:text-dark-900/[0.68] focus:border-primary"
      />
    </label>
  </div>
);

export default PengumumanFilterBar;
