import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { eventCategories, getEventCategory } from '../../../data/eventCategories';
import EventCategoryLabel from '../../../components/kalender/EventCategoryLabel';

export default function EventCategorySelect({ id, value, onChange, className, ...accessibility }) {
  const [open, setOpen] = useState(false), [active, setActive] = useState(0);
  const root = useRef(null), trigger = useRef(null);
  const category = getEventCategory(value);
  const options = value && category.legacy ? [category, ...eventCategories] : eventCategories;
  const selected = Math.max(0, options.findIndex(option => option.value === value));
  useEffect(() => {
    if (!open) return;
    const closeOutside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);
  useEffect(() => { if (open) document.getElementById(`${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' }); }, [open, active, id]);
  const choose = index => { onChange(options[index].value); setOpen(false); trigger.current?.focus(); };
  const onKeyDown = event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); return; }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      if (!open) { setActive(selected); setOpen(true); return; }
      if (event.key === 'Enter' || event.key === ' ') { choose(active); return; }
      setActive(index => event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const index = options.findIndex(option => option.label.toLocaleLowerCase('id-ID').startsWith(event.key.toLocaleLowerCase('id-ID')));
      if (index >= 0) { event.preventDefault(); setActive(index); setOpen(true); }
    }
  };
  return <div ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} id={id} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-options` : undefined} aria-activedescendant={open ? `${id}-option-${active}` : undefined} aria-required="true" {...accessibility}
      onKeyDown={onKeyDown} onClick={() => { setActive(selected); setOpen(current => !current); }} className={`${className} flex min-h-11 items-center justify-between gap-2 text-left`}>
      {value ? <EventCategoryLabel category={value} compact={false} /> : <span className="text-dark-500">Pilih kategori kegiatan</span>}<ChevronDown className="size-4 shrink-0 text-dark-500" />
    </button>
    {open && <ul id={`${id}-options`} role="listbox" aria-label="Kategori Kegiatan" className="mt-1 max-h-56 overflow-y-auto rounded-lg border border-dark-200 bg-white p-1 shadow-soft" data-lenis-prevent>
      {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value} onPointerDown={event => event.preventDefault()} onClick={() => choose(index)} onPointerMove={() => setActive(index)} className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded px-2 py-2 ${active === index ? 'bg-dark-100 outline-1 outline-primary' : 'hover:bg-dark-50'}`}>
        <EventCategoryLabel category={option.value} compact={false} />{option.value === value && <Check className="size-4 shrink-0 text-primary" />}
      </li>)}
    </ul>}
  </div>;
}
