import accent from '../assets/landing/figma-section-accent.png';

// Koordinat pusat dan rotasi dari Figma; Y disesuaikan terhadap section existing.
// Ukuran dibatasi kedua sumbu supaya tinggi konten tidak memperbesar dekorasi.
const positions = {
  departments: [
    ['24:594', 'left-[0.62085%] top-[14.45668%] size-[min(12.6115cqw,28.91331cqh)] rotate-[0deg]'],
    ['24:468', 'left-[12.31569%] top-[14.45668%] size-[min(12.6115cqw,28.91331cqh)] rotate-[90.03405deg]'],
    ['24:471', 'left-[0.76247%] top-[39.0115%] size-[min(12.6115cqw,28.91331cqh)] rotate-[90.43955deg]'],
    ['24:474', 'left-[0.67275%] top-[65.79587%] size-[min(12.6115cqw,28.91331cqh)] rotate-[-179.5264deg]'],
    ['24:378', 'left-[94.31958%] top-[31.93629%] size-[min(12.6115cqw,28.91331cqh)] rotate-[90.43955deg]'],
    ['24:381', 'left-[94.22987%] top-[58.72066%] size-[min(12.6115cqw,28.91331cqh)] rotate-[-179.5264deg]'],
    ['24:384', 'left-[94.23545%] top-[85.39249%] size-[min(12.6115cqw,28.91331cqh)] rotate-[-179.39886deg]'],
    ['24:387', 'left-[82.55285%] top-[85.11129%] size-[min(12.6115cqw,28.91331cqh)] rotate-[-89.36481deg]'],
  ],
  achievements: [
    ['24:404', 'left-[87.13953%] top-[25.71037%] size-[min(12.6115cqw,48.95666cqh)] rotate-[0deg]'],
    ['24:407', 'left-[98.3469%] top-[70.47736%] size-[min(12.6115cqw,48.95666cqh)] rotate-[0deg]'],
    ['24:410', 'left-[88.87207%] top-[75.52153%] size-[min(12.6115cqw,48.95666cqh)] rotate-[-90deg]'],
    ['24:708', 'left-[98.83792%] top-[24.46387%] size-[min(12.6115cqw,48.95666cqh)] rotate-[90.03405deg]'],
  ],
  schoolTeachers: [
    ['24:883', 'left-[13.90042%] top-[80.04703%] size-[min(12.6115cqw,32.78147cqh)] rotate-[-179.5176deg]'],
    ['24:886', 'left-[3.96253%] top-[56.89901%] size-[min(12.6115cqw,32.78147cqh)] rotate-[-179.5176deg]'],
    ['24:889', 'left-[3.38453%] top-[83.75751%] size-[min(12.6115cqw,32.78147cqh)] rotate-[-89.48354deg]'],
    ['24:894', 'left-[88.33441%] top-[20.32155%] size-[min(12.6115cqw,32.78147cqh)] rotate-[0deg]'],
    ['24:897', 'left-[98.3469%] top-[43.25126%] size-[min(12.6115cqw,32.78147cqh)] rotate-[0deg]'],
    ['24:900', 'left-[88.87207%] top-[46.62884%] size-[min(12.6115cqw,32.78147cqh)] rotate-[-90deg]'],
    ['24:964', 'left-[98.83789%] top-[16.38105%] size-[min(12.6115cqw,32.78147cqh)] rotate-[90.03405deg]'],
  ],
  headmaster: [
    ['12:64', 'left-[83.78274%] top-[27.06375%] size-[min(12.6115cqw,51.53414cqh)] rotate-[0deg]'],
    ['12:67', 'left-[94.9901%] top-[74.18765%] size-[min(12.6115cqw,51.53414cqh)] rotate-[0deg]'],
    ['12:70', 'left-[95.48113%] top-[25.75168%] size-[min(12.6115cqw,51.53414cqh)] rotate-[90.03405deg]'],
  ],
  teachers: [
    ['12:73', 'left-[16.2212%] top-[72.89102%] size-[min(12.6115cqw,51.53414cqh)] rotate-[179.99999deg]'],
    ['12:76', 'left-[5.01384%] top-[25.76713%] size-[min(12.6115cqw,51.53414cqh)] rotate-[179.99999deg]'],
    ['12:79', 'left-[4.52281%] top-[74.20309%] size-[min(12.6115cqw,51.53414cqh)] rotate-[-89.96595deg]'],
  ],
  departmentsQuiz: [
    ['24:2052', 'left-[84.97386%] top-[21.33367%] size-[min(12.6115cqw,27.38426cqh)] rotate-[0deg]'],
    ['24:2055', 'left-[94.98635%] top-[40.48814%] size-[min(12.6115cqw,27.38426cqh)] rotate-[0deg]'],
    ['24:2058', 'left-[94.71939%] top-[66.23425%] size-[min(12.6115cqw,27.38426cqh)] rotate-[0deg]'],
    ['24:2061', 'left-[84.97386%] top-[66.23428%] size-[min(12.6115cqw,27.38426cqh)] rotate-[-90deg]'],
    ['24:2064', 'left-[85.51152%] top-[43.30966%] size-[min(12.6115cqw,27.38426cqh)] rotate-[-90deg]'],
    ['24:2067', 'left-[95.47737%] top-[18.04194%] size-[min(12.6115cqw,27.38426cqh)] rotate-[90.03405deg]'],
  ],
  activities: [
    ['59:144', 'left-[95.88967%] top-[16.4727%] size-[min(12.6115cqw,15.84125cqh)] rotate-[90.43955deg]'],
    ['59:153', 'left-[95.79996%] top-[31.14753%] size-[min(12.6115cqw,15.84125cqh)] rotate-[-179.5264deg]'],
    ['59:162', 'left-[95.80556%] top-[45.7607%] size-[min(12.6115cqw,15.84125cqh)] rotate-[-179.39886deg]'],
    ['59:192', 'left-[13.88581%] top-[7.91594%] size-[min(12.6115cqw,15.84125cqh)] rotate-[90.03405deg]'],
    ['59:195', 'left-[2.33258%] top-[24.42956%] size-[min(12.6115cqw,15.84125cqh)] rotate-[90.43955deg]'],
    ['59:210', 'left-[-1.27635%] top-[92.01413%] size-[min(12.6115cqw,15.84125cqh)] rotate-[-179.5264deg]'],
    ['59:409', 'left-[2.19097%] top-[12.33643%] size-[min(12.6115cqw,15.84125cqh)] rotate-[0deg]'],
  ],
};

export default function SectionAccents({ variant }) {
  return (
    <div aria-hidden="true" data-accent-section={variant} className="pointer-events-none absolute inset-0 overflow-hidden [container-type:size]">
      {positions[variant].map(([id, position]) => (
        <img key={id} data-figma-node={id} src={accent} alt="" className={`absolute max-w-none -translate-x-1/2 -translate-y-1/2 select-none ${position}`} />
      ))}
    </div>
  );
}

