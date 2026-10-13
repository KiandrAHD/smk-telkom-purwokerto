export const campusHintKey = 'smk-campus-drag-understood-v1';
export const panLimit = (viewportWidth, imageWidth) => Math.max(0, imageWidth - viewportWidth);
export const clampPan = (value, maximum) => Math.min(Math.max(0, value), maximum);
export const centerCampusPoint = (x, imageWidth, viewportWidth) => clampPan(x * imageWidth - viewportWidth / 2, panLimit(viewportWidth, imageWidth));
export const meaningfulPan = (start, current) => Math.abs(current - start) >= 24;
export function gestureAxis(dx, dy) {
  if (Math.abs(dx) >= 8 && Math.abs(dx) > Math.abs(dy) * 1.1) return 'horizontal';
  if (Math.abs(dy) >= 8 && Math.abs(dy) > Math.abs(dx) * 1.1) return 'vertical';
  return 'pending';
}
export function readCampusHint(storage) {
  try { return (storage || globalThis.localStorage).getItem(campusHintKey) === '1'; } catch { return false; }
}
export function saveCampusHint(storage) {
  try { (storage || globalThis.localStorage).setItem(campusHintKey, '1'); return true; } catch { return false; }
}
