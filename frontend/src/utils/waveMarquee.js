export const loopDistance = (distance, length) => ((distance % length) + length) % length;

// Centerline of Figma's ribbon, with tangent extensions outside the visible SVG.
export function wavePath(baseline = 0) {
  return `M -2200 ${-646.98 + baseline} L 0 ${86.351 + baseline} C 703.241 ${320.799 + baseline} 1196.57 ${-8.581 + baseline} 1937.06 ${86.35 + baseline} L 6500 ${671.32 + baseline}`;
}
