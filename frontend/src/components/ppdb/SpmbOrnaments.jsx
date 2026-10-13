import left46 from '../../assets/spmb/ornament-left-46.svg';
import left47 from '../../assets/spmb/ornament-left-47.svg';
import left48 from '../../assets/spmb/ornament-left-48.svg';
import left49 from '../../assets/spmb/ornament-left-49.svg';
import left187 from '../../assets/spmb/ornament-left-187.svg';
import left188 from '../../assets/spmb/ornament-left-188.svg';
import left192 from '../../assets/spmb/ornament-left-192.svg';
import left193 from '../../assets/spmb/ornament-left-193.svg';
import left194 from '../../assets/spmb/ornament-left-194.svg';
import left195 from '../../assets/spmb/ornament-left-195.svg';
import right42 from '../../assets/spmb/ornament-right-42.svg';
import right43 from '../../assets/spmb/ornament-right-43.svg';
import right44 from '../../assets/spmb/ornament-right-44.svg';
import right45 from '../../assets/spmb/ornament-right-45.svg';

// Original vectors remain separate; placements follow nodes 1165:4828–4856.
export default function SpmbOrnaments() {
  return <div aria-hidden="true" className="pointer-events-none hidden lg:block">
    <div className="spmb-ornament-left">{[left48, left47, left49, left46, left193, left194, left192, left195, left188, left187].map(src => <img src={src} alt="" loading="lazy" key={src} />)}</div>
    <div className="spmb-ornament-right"><div className="spmb-ornament-petals">{[right42, right43, right45, right44].map(src => <img src={src} alt="" loading="lazy" key={src} />)}</div><div className="spmb-ornament-diamond"><span /></div><div className="spmb-ornament-grey">{[0, 1, 2, 3].map(index => <span key={index} />)}</div></div>
  </div>;
}
