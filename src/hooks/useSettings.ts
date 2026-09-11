import { useState, useEffect, useCallback } from 'react';
import { Settings, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEY = 'deskcharms-settings';

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (typeof window !== 'undefined' && window.__TAURI__) {
          const { Store } = await import('@tauri-apps/plugin-store');
          const store = await Store.load('settings.json');
          const saved = await store.get<Settings>('settings');
          if (saved) {
            setSettingsState({ ...DEFAULT_SETTINGS, ...saved });
          }
        } else {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
          }
        }
      } catch (error) {
        console.warn('Failed to load settings, using defaults:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      if (typeof window !== 'undefined' && window.__TAURI__) {
        const { Store } = await import('@tauri-apps/plugin-store');
        const store = await Store.load('settings.json');
        await store.set('settings', newSettings);
        await store.save();
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      }
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettingsState((prev) => {
      const newSettings = { ...prev, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
  }, [saveSettings]);

  const setSelectedCharm = useCallback((charmId: string, customEmoji?: string) => {
    updateSettings({
      selectedCharmId: charmId,
      customEmoji: customEmoji ?? settings.customEmoji,
    });
  }, [updateSettings, settings.customEmoji]);

  const toggleSound = useCallback(() => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  }, [updateSettings, settings.soundEnabled]);

  const setRopeLength = useCallback((length: number) => {
    updateSettings({ ropeLength: Math.max(80, Math.min(250, length)) });
  }, [updateSettings]);

  const setCharmSize = useCallback((size: number) => {
    updateSettings({ charmSize: Math.max(24, Math.min(72, size)) });
  }, [updateSettings]);

  return {
    settings,
    isLoaded,
    setSelectedCharm,
    toggleSound,
    setRopeLength,
    setCharmSize,
    updateSettings,
  };
}
