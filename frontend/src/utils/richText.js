import sanitizeHtml from 'sanitize-html';

export const isRichText = (value) => /<\/?(?:p|h[2-4]|ul|ol|li|strong|b|em|i|u|s|blockquote|pre|code|table|thead|tbody|tr|th|td|div|br|hr|a)\b[^>]*>/i.test(String(value || ''));
export const sanitizeRichText = (value) => sanitizeHtml(String(value || ''), {
  allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
  allowedAttributes: { a: ['href', 'title', 'rel'], p: ['style'], h2: ['style'], h3: ['style'], h4: ['style'], ol: ['start'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan'] },
  allowedStyles: { '*': { 'text-align': [/^(left|center|right|justify)$/] } },
  allowedSchemes: ['https', 'http', 'mailto', 'tel'],
  allowProtocolRelative: false,
  transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
});
export const richTextToPlain = (value) => {
  if (!isRichText(value)) return String(value || '');
  return sanitizeHtml(sanitizeRichText(value).replace(/<\/(?:p|h[2-4]|li|blockquote|tr)>|<br\s*\/?\s*>/gi, '\n'), { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
};
export const toEditorHtml = (value) => isRichText(value) ? sanitizeRichText(value) : String(value || '').split('\n').map(line => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}</p>`).join('');
