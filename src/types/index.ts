export type RitualAnimation = 'spin' | 'bounce' | 'pulse' | 'shake' | 'glow';

export interface Charm {
  id: string;
  name: string;
  emoji?: string;
  iconSvg?: string;
  culture: string;
  description: string;
  ritualAnimation: RitualAnimation;
  soundFile?: string;
}

export interface RopeState {
  angle: number;
  angularVelocity: number;
  length: number;
  stretch: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RopeSegment {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Settings {
  selectedCharmId: string;
  soundEnabled: boolean;
  ropeLength: number;
  charmSize: number;
  customEmoji?: string;
  anchorX?: number;
}

export const DEFAULT_SETTINGS: Settings = {
  selectedCharmId: 'nazar',
  soundEnabled: true,
  ropeLength: 150,
  charmSize: 48,
  anchorX: 960,
};
