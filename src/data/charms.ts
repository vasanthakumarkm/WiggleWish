import { Charm } from '../types';

export const CHARMS: Charm[] = [
  {
    id: 'nazar',
    name: 'Nazar',
    emoji: '🧿',
    culture: 'Turkey / Middle East',
    description: 'Wards off the evil eye and negative energy',
    ritualAnimation: 'pulse',
    soundFile: 'chime.mp3',
  },
  {
    id: 'hamsa',
    name: 'Hamsa',
    emoji: '🪬',
    culture: 'Middle East / North Africa',
    description: 'Protection and blessing, brings happiness',
    ritualAnimation: 'glow',
    soundFile: 'soft-bell.mp3',
  },
  {
    id: 'clover',
    name: 'Four-Leaf Clover',
    emoji: '🍀',
    culture: 'Ireland',
    description: 'Faith, hope, love, and luck',
    ritualAnimation: 'bounce',
    soundFile: 'twinkle.mp3',
  },
  {
    id: 'maneki',
    name: 'Maneki-neko',
    emoji: '🐱',
    culture: 'Japan',
    description: 'Beckoning cat, brings good fortune',
    ritualAnimation: 'shake',
    soundFile: 'meow.mp3',
  },
  {
    id: 'scarab',
    name: 'Scarab',
    emoji: '🪲',
    culture: 'Egypt',
    description: 'Rebirth, transformation, and protection',
    ritualAnimation: 'spin',
    soundFile: 'mystical.mp3',
  },
  {
    id: 'om',
    name: 'Om',
    emoji: '🕉️',
    culture: 'India',
    description: 'Sacred sound of the universe, inner peace',
    ritualAnimation: 'pulse',
    soundFile: 'om.mp3',
  },
  {
    id: 'fu',
    name: 'Fu Character',
    emoji: '🧧',
    culture: 'China',
    description: 'Fortune and good luck',
    ritualAnimation: 'glow',
    soundFile: 'gong.mp3',
  },
  {
    id: 'horseshoe',
    name: 'Horseshoe',
    emoji: '🧲',
    culture: 'Western',
    description: 'Attracts good luck and wards off evil',
    ritualAnimation: 'bounce',
    soundFile: 'clang.mp3',
  },
  {
    id: 'star',
    name: 'Lucky Star',
    emoji: '⭐',
    culture: 'Universal',
    description: 'Wishes and dreams come true',
    ritualAnimation: 'spin',
    soundFile: 'sparkle.mp3',
  },
  {
    id: 'custom',
    name: 'Custom Emoji',
    emoji: '✨',
    culture: 'Personal',
    description: 'Your own lucky charm',
    ritualAnimation: 'bounce',
  },
];

export function getCharmById(id: string): Charm | undefined {
  return CHARMS.find((c) => c.id === id);
}

export function createCustomCharm(emoji: string): Charm {
  return {
    id: 'custom',
    name: 'Custom Emoji',
    emoji,
    culture: 'Personal',
    description: 'Your own lucky charm',
    ritualAnimation: 'bounce',
  };
}
