import { useRef, useCallback, useEffect, useState } from 'react';
import { Point } from '../types';

// Physics constants tuned for realistic motion
const GRAVITY = 1200;
const AIR_RESISTANCE = 0.02;
const ROPE_STIFFNESS = 0.8;
const NUM_POINTS = 12;
const ITERATIONS = 8;

interface VerletPoint {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
}

interface UseRopeOptions {
  anchorX: number;
  anchorY: number;
  length: number;
}

interface UseRopeReturn {
  segments: Point[];
  charmPosition: Point;
  stretch: number;
  isDragging: boolean;
  startDrag: (clientX: number, clientY: number) => void;
  updateDrag: (clientX: number, clientY: number) => void;
  endDrag: (velocityX: number, velocityY: number) => void;
  applyImpulse: (vx: number, vy: number) => void;
  reset: () => void;
}

export function useRope({
  anchorX,
  anchorY,
  length,
}: UseRopeOptions): UseRopeReturn {
  const segmentLength = length / (NUM_POINTS - 1);

  const pointsRef = useRef<VerletPoint[]>([]);
  const isDraggingRef = useRef(false);
  const dragPosRef = useRef<Point | null>(null);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef(performance.now());

  const [displaySegments, setDisplaySegments] = useState<Point[]>([]);
  const [charmPosition, setCharmPosition] = useState<Point>({ x: anchorX, y: anchorY + length });
  const [stretch, setStretch] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize verlet points
  useEffect(() => {
    const pts: VerletPoint[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const y = anchorY + (length * i) / (NUM_POINTS - 1);
      pts.push({
        x: anchorX,
        y: y,
        oldX: anchorX + (Math.random() - 0.5) * 3,
        oldY: y,
        pinned: i === 0, // First point is pinned (anchor)
      });
    }
    pointsRef.current = pts;
  }, [anchorX, anchorY, length]);

  // Verlet integration physics loop
  useEffect(() => {
    const simulate = () => {
      const now = performance.now();
      const rawDt = (now - lastTimeRef.current) / 1000;
      const dt = Math.min(rawDt, 0.025);
      lastTimeRef.current = now;

      const points = pointsRef.current;
      if (points.length === 0) {
        frameRef.current = requestAnimationFrame(simulate);
        return;
      }

      // Apply verlet integration to each point
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.pinned) continue;

        // Handle dragging - last point follows mouse
        if (isDraggingRef.current && dragPosRef.current && i === points.length - 1) {
          const target = dragPosRef.current;
          // Smooth follow with some lag for realism
          const followSpeed = 0.6;
          const newX = p.x + (target.x - p.x) * followSpeed;
          const newY = p.y + (target.y - p.y) * followSpeed;

          p.oldX = p.x;
          p.oldY = p.y;
          p.x = newX;
          p.y = newY;
          continue;
        }

        // Verlet integration
        const vx = (p.x - p.oldX) * (1 - AIR_RESISTANCE);
        const vy = (p.y - p.oldY) * (1 - AIR_RESISTANCE);

        p.oldX = p.x;
        p.oldY = p.y;

        // Apply velocity and gravity
        p.x += vx;
        p.y += vy + GRAVITY * dt * dt;

        // Subtle wind effect
        const time = now / 1000;
        const wind = Math.sin(time * 0.5) * 0.3 + Math.sin(time * 1.3) * 0.1;
        p.x += wind * (i / points.length);
      }

      // Constraint solving - maintain rope segment lengths
      for (let iter = 0; iter < ITERATIONS; iter++) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 0.0001) continue;

          const diff = (segmentLength - dist) / dist;
          const offsetX = dx * diff * 0.5 * ROPE_STIFFNESS;
          const offsetY = dy * diff * 0.5 * ROPE_STIFFNESS;

          if (!p1.pinned) {
            p1.x -= offsetX;
            p1.y -= offsetY;
          }
          if (!p2.pinned && !(isDraggingRef.current && i === points.length - 2)) {
            p2.x += offsetX;
            p2.y += offsetY;
          }
        }
      }

      // Calculate total rope length for stretch visualization
      let totalLength = 0;
      for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }

      const lastPoint = points[points.length - 1];

      // Update React state
      setStretch(Math.min(1.5, Math.max(0.9, totalLength / length)));
      setDisplaySegments(points.map(p => ({ x: p.x, y: p.y })));
      setCharmPosition({ x: lastPoint.x, y: lastPoint.y });

      frameRef.current = requestAnimationFrame(simulate);
    };

    frameRef.current = requestAnimationFrame(simulate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [anchorX, anchorY, length, segmentLength]);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragPosRef.current = { x: clientX, y: clientY };
    setIsDragging(true);
  }, []);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (isDraggingRef.current) {
      dragPosRef.current = { x: clientX, y: clientY };
    }
  }, []);

  const endDrag = useCallback((velocityX: number, velocityY: number) => {
    isDraggingRef.current = false;
    dragPosRef.current = null;
    setIsDragging(false);

    // Apply release velocity using verlet (modify oldX/oldY)
    const points = pointsRef.current;
    if (points.length > 0) {
      // Apply velocity to bottom half of rope for natural swing
      for (let i = Math.floor(points.length / 2); i < points.length; i++) {
        const factor = (i - points.length / 2) / (points.length / 2);
        points[i].oldX = points[i].x - velocityX * factor * 0.05;
        points[i].oldY = points[i].y - velocityY * factor * 0.05;
      }
    }
  }, []);

  const applyImpulse = useCallback((vx: number, vy: number) => {
    const points = pointsRef.current;
    // Apply impulse to all non-pinned points
    for (let i = 1; i < points.length; i++) {
      const factor = i / points.length;
      points[i].oldX = points[i].x - vx * factor * 0.02;
      points[i].oldY = points[i].y - vy * factor * 0.02;
    }
  }, []);

  const reset = useCallback(() => {
    const pts: VerletPoint[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const y = anchorY + (length * i) / (NUM_POINTS - 1);
      pts.push({
        x: anchorX,
        y: y,
        oldX: anchorX,
        oldY: y,
        pinned: i === 0,
      });
    }
    pointsRef.current = pts;
  }, [anchorX, anchorY, length]);

  return {
    segments: displaySegments,
    charmPosition,
    stretch,
    isDragging,
    startDrag,
    updateDrag,
    endDrag,
    applyImpulse,
    reset,
  };
}
