import { Point } from '../types';

interface RopeProps {
  anchorX: number;
  anchorY: number;
  segments: Point[];
  stretch: number;
}

// Create smooth Catmull-Rom spline through points
function catmullRomSpline(points: Point[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Bezier conversion
    const tension = 0.5;
    const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
    const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
    const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
    const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

export function Rope({ anchorX, anchorY, segments, stretch }: RopeProps) {
  if (segments.length < 2) return null;

  const pathD = catmullRomSpline(segments);

  // Visual properties based on stretch
  const isStretched = stretch > 1.05;
  const isTight = stretch > 1.15;

  // Rope gets thinner when stretched
  const baseWidth = 2.5;
  const strokeWidth = Math.max(1.2, baseWidth - (stretch - 1) * 4);

  // Color changes when stretched
  const ropeColor = isTight
    ? 'rgb(140, 90, 60)'
    : isStretched
    ? 'rgb(100, 75, 55)'
    : 'rgb(70, 60, 50)';

  const ropeOpacity = 0.85;

  return (
    <g>
      {/* Soft shadow */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0, 0, 0, 0.12)"
        strokeWidth={strokeWidth + 3}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2, 3)"
        style={{ filter: 'blur(2px)' }}
      />

      {/* Main rope */}
      <path
        d={pathD}
        fill="none"
        stroke={ropeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={ropeOpacity}
      />

      {/* Rope highlight (3D effect) */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth={strokeWidth * 0.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-0.5, -0.5)"
      />

      {/* Anchor mount */}
      <ellipse
        cx={anchorX}
        cy={anchorY + 2}
        rx={6}
        ry={3}
        fill="rgba(0,0,0,0.2)"
      />
      <circle cx={anchorX} cy={anchorY} r={5} fill="#4a4a4a" />
      <circle cx={anchorX} cy={anchorY} r={3.5} fill="#5a5a5a" />
      <circle cx={anchorX} cy={anchorY} r={2} fill="#6a6a6a" />
      <circle cx={anchorX - 1} cy={anchorY - 1} r={1} fill="rgba(255,255,255,0.3)" />
    </g>
  );
}
