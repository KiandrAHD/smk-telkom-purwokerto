import topLeft from '../assets/tentang/teacher-border/top-left.svg';
import topRight from '../assets/tentang/teacher-border/top-right.svg';
import bottomLeft from '../assets/tentang/teacher-border/bottom-left.svg';
import bottomRight from '../assets/tentang/teacher-border/bottom-right.svg';
import './TeacherCard.css';

// Original transparent SVG exports from Figma: 309:2146, 309:2350, 309:2554, 309:1942.
export default function TeacherCardBorder() {
  return <div className="teacher-card-border" aria-hidden="true" data-teacher-border="309:1687">
    <img src={topLeft} alt="" className="teacher-card-corner teacher-card-corner--top-left" />
    <img src={topRight} alt="" className="teacher-card-corner teacher-card-corner--top-right" />
    <img src={bottomLeft} alt="" className="teacher-card-corner teacher-card-corner--bottom-left" />
    <img src={bottomRight} alt="" className="teacher-card-corner teacher-card-corner--bottom-right" />
  </div>;
}
