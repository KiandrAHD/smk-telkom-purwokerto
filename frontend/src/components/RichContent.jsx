import { isRichText, sanitizeRichText } from '../utils/richText';
import './rich-content.css';

export default function RichContent({ value, className = '' }) {
  return isRichText(value)
    ? <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }} />
    : <div className={`rich-content whitespace-pre-wrap ${className}`}>{value}</div>;
}
