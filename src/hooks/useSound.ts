import { useCallback, useRef } from 'react';

export function useSound(enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((soundFile?: string) => {
    if (!enabled || !soundFile) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(`/sounds/${soundFile}`);
      audio.volume = 0.5;
      audioRef.current = audio;

      audio.play().catch(() => {
        // Sound file not found or playback failed - fail silently
      });
    } catch {
      // Audio not supported - fail silently
    }
  }, [enabled]);

  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { playSound, stopSound };
}
