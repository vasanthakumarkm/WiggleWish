import { useState, useCallback, useEffect } from 'react';
import { Charm as CharmType, RitualAnimation } from '../types';

interface CharmProps {
  charm: CharmType;
  x: number;
  y: number;
  size: number;
  stretch: number;
  isDragging: boolean;
  customEmoji?: string;
  onRitual: () => void;
}

const ANIMATION_DURATION = 500;

export function Charm({
  charm,
  x,
  y,
  size,
  stretch,
  isDragging,
  customEmoji,
  onRitual,
}: CharmProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<RitualAnimation | null>(null);
  const [isNewCharm, setIsNewCharm] = useState(false);
  const [animationOffset, setAnimationOffset] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });

  // Trigger bounce animation when charm changes
  useEffect(() => {
    setIsNewCharm(true);
    setAnimationOffset({ x: 0, y: 0, scale: 1.3, rotation: 0 });

    const timer1 = setTimeout(() => {
      setAnimationOffset({ x: 0, y: 0, scale: 1, rotation: 0 });
    }, 150);

    const timer2 = setTimeout(() => setIsNewCharm(false), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [charm.id, customEmoji]);

  // Handle ritual animations
  useEffect(() => {
    if (!isAnimating || !animationType) return;

    let frames: { x: number; y: number; scale: number; rotation: number }[] = [];

    switch (animationType) {
      case 'spin':
        frames = [
          { x: 0, y: 0, scale: 1, rotation: 0 },
          { x: 0, y: 0, scale: 1.1, rotation: 180 },
          { x: 0, y: 0, scale: 1, rotation: 360 },
        ];
        break;
      case 'bounce':
        frames = [
          { x: 0, y: 0, scale: 1, rotation: 0 },
          { x: 0, y: -20, scale: 1.1, rotation: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0 },
        ];
        break;
      case 'pulse':
        frames = [
          { x: 0, y: 0, scale: 1, rotation: 0 },
          { x: 0, y: 0, scale: 1.4, rotation: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0 },
        ];
        break;
      case 'shake':
        frames = [
          { x: 0, y: 0, scale: 1, rotation: 0 },
          { x: -8, y: 0, scale: 1, rotation: -5 },
          { x: 8, y: 0, scale: 1, rotation: 5 },
          { x: -5, y: 0, scale: 1, rotation: -3 },
          { x: 5, y: 0, scale: 1, rotation: 3 },
          { x: 0, y: 0, scale: 1, rotation: 0 },
        ];
        break;
      case 'glow':
        frames = [
          { x: 0, y: 0, scale: 1, rotation: 0 },
          { x: 0, y: -5, scale: 1.15, rotation: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0 },
        ];
        break;
    }

    let frameIndex = 0;
    const frameTime = ANIMATION_DURATION / frames.length;

    const interval = setInterval(() => {
      if (frameIndex < frames.length) {
        setAnimationOffset(frames[frameIndex]);
        frameIndex++;
      } else {
        clearInterval(interval);
      }
    }, frameTime);

    return () => clearInterval(interval);
  }, [isAnimating, animationType]);

  const triggerRitual = useCallback(() => {
    if (isAnimating || isDragging) return;

    setIsAnimating(true);
    setAnimationType(charm.ritualAnimation);
    onRitual();

    setTimeout(() => {
      setIsAnimating(false);
      setAnimationType(null);
      setAnimationOffset({ x: 0, y: 0, scale: 1, rotation: 0 });
    }, ANIMATION_DURATION);
  }, [isAnimating, isDragging, charm.ritualAnimation, onRitual]);

  const emoji = charm.id === 'custom' && customEmoji ? customEmoji : charm.emoji;
  const displaySize = size * (0.9 + stretch * 0.1);

  const finalX = x + animationOffset.x;
  const finalY = y + animationOffset.y;
  const finalScale = animationOffset.scale;
  const finalRotation = animationOffset.rotation;

  return (
    <g
      transform={`translate(${finalX}, ${finalY}) rotate(${finalRotation}) scale(${finalScale})`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onClick={(e) => {
        e.stopPropagation();
        triggerRitual();
      }}
      role="button"
      aria-label={`${charm.name} charm - ${charm.description}`}
    >
      {/* Glow effect for glow animation */}
      {isAnimating && animationType === 'glow' && (
        <circle
          cx={0}
          cy={0}
          r={displaySize * 0.7}
          fill="rgba(255, 215, 0, 0.4)"
        />
      )}

      {/* Selection glow */}
      {isNewCharm && (
        <circle
          cx={0}
          cy={0}
          r={displaySize * 0.65}
          fill="none"
          stroke="rgba(100, 200, 255, 0.6)"
          strokeWidth={3}
        />
      )}

      {/* Drop shadow */}
      <ellipse
        cx={3}
        cy={displaySize * 0.35}
        rx={displaySize * 0.25}
        ry={displaySize * 0.1}
        fill="rgba(0,0,0,0.2)"
      />

      {/* Background circle for visibility */}
      <circle
        cx={0}
        cy={0}
        r={displaySize * 0.5}
        fill="rgba(255,255,255,0.15)"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={1}
      />

      {/* Emoji charm */}
      <text
        x={0}
        y={displaySize * 0.12}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={displaySize * 0.85}
        style={{
          userSelect: 'none',
          filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.35))',
        }}
      >
        {emoji}
      </text>

      {/* Larger invisible hitbox for easier clicking */}
      <circle
        cx={0}
        cy={0}
        r={displaySize * 0.7}
        fill="transparent"
        style={{ cursor: 'pointer' }}
      />
    </g>
  );
}
