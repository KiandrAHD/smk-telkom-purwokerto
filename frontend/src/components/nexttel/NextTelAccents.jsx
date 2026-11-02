const shapes = [
  { asset: 'accent-ellipse-312.svg', x: 329.924, y: 37.956, rotate: -90, width: 145.985, height: 70.073 },
  { asset: 'accent-ellipse-313.svg', x: 256.934, y: 35.036, rotate: 90, width: 145.985, height: 75.9124 },
  { asset: 'accent-ellipse-314.svg', x: 216.06, y: 71.53, width: 75.9124, height: 74.4525 },
  { asset: 'accent-ellipse-315.svg', x: 143.8, y: 73.72, rotate: 90, width: 74.4525, height: 70.073 },
  { asset: 'accent-ellipse-316.svg', x: 145.99, y: 0, rotate: 180, width: 70.073, height: 75.9124 },
  { asset: 'accent-ellipse-317.svg', x: 216.06, y: 0, rotate: -90, width: 75.9124, height: 75.9124 },
  { asset: 'accent-vector-76.svg', x: 9.49, y: 66.53, rotate: 90, width: 86.1314, height: 64.009 },
  { asset: 'accent-vector-77.svg', x: -10.22, y: 10.34, rotate: -90, width: 90.511, height: 69.8381 },
  { asset: 'accent-vector-78.svg', x: 50.37, y: 15.45, rotate: -90, width: 84.6715, height: 65.4577 },
  { asset: 'accent-vector-79.svg', x: 68.57, y: 67.06, rotate: 90, width: 86.1314, height: 64.009 },
];

// Native-size Figma assets rotate around their centres; only the outer SVG scales.
export default function NextTelAccents() {
  return <div className="nexttel-accents" aria-hidden="true">
    <svg className="nexttel-accents__top" viewBox="0 0 437.96 146" fill="none">
      {shapes.map(({ asset, x, y, rotate = 0, width, height }) => <image key={asset} href={`/assets/nexttel/${asset}`} x={x} y={y} width={width} height={height} transform={`rotate(${rotate} ${x + width / 2} ${y + height / 2})`} />)}
    </svg>
    <svg className="nexttel-accents__rail" viewBox="0 0 177 800" preserveAspectRatio="none" fill="none">
      <path fill="white" d="M95 0h82v800H95z" />
      <rect x="0" y="35.04" width="153.28" height="710.95" rx="20" fill="white" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x="35.15" y={49.75 + i * 70.073} width="49.879" height="49.879" transform={`rotate(45 60.09 ${74.69 + i * 70.073})`} fill="#9d0000" />)}
      {Array.from({ length: 9 }, (_, i) => <rect key={`back-${i}`} x="127" y={i === 0 ? 0 : 81.82 + (i - 1) * 92.727} width="32.842" height="69.091" fill={i % 2 ? '#878787' : '#ab0a1b'} stroke="white" strokeWidth="2" />)}
      {Array.from({ length: 8 }, (_, i) => <rect key={`front-${i}`} x="143.43" y={34.54 + i * 92.727} width="32.842" height="69.091" fill={i % 2 ? '#cd091d' : '#bbb'} stroke="white" strokeWidth="2" />)}
    </svg>
  </div>;
}
