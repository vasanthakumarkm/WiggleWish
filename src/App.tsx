import { useState, useEffect, useCallback, useRef } from 'react';
import { useRope } from './hooks/useRope';
import { useSettings } from './hooks/useSettings';
import { useSound } from './hooks/useSound';
import { Rope } from './components/Rope';
import { Charm } from './components/Charm';
import { CharmPicker } from './components/CharmPicker';
import { getCharmById, createCustomCharm } from './data/charms';
import { Charm as CharmType } from './types';

const WINDOW_WIDTH = 250;
const ANCHOR_X = WINDOW_WIDTH / 2;
const ANCHOR_Y = 8;

export default function App() {
  const { settings, isLoaded, setSelectedCharm, toggleSound } = useSettings();
  const { playSound } = useSound(settings.soundEnabled);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const dragStartRef = useRef({ x: 0, screenX: 0 });

  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const {
    segments,
    charmPosition,
    stretch,
    isDragging,
    startDrag,
    updateDrag,
    endDrag,
    applyImpulse,
  } = useRope({
    anchorX: ANCHOR_X,
    anchorY: ANCHOR_Y,
    length: settings.ropeLength,
  });

  const currentCharm: CharmType = settings.selectedCharmId === 'custom' && settings.customEmoji
    ? createCustomCharm(settings.customEmoji)
    : getCharmById(settings.selectedCharmId) || getCharmById('nazar')!;

  // Move window function
  const moveWindow = useCallback(async (deltaX: number) => {
    if (typeof window !== 'undefined' && window.__TAURI__) {
      try {
        const { getCurrentWindow, PhysicalPosition } = await import('@tauri-apps/api/window');
        const win = getCurrentWindow();
        const pos = await win.outerPosition();
        await win.setPosition(new PhysicalPosition(pos.x + deltaX, 0));
      } catch (err) {
        console.error('Move window error:', err);
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = performance.now();
    const dt = now - lastMousePos.current.time;

    if (dt > 0) {
      velocityRef.current = {
        x: (e.clientX - lastMousePos.current.x) / dt * 16,
        y: (e.clientY - lastMousePos.current.y) / dt * 16,
      };
    }

    lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

    if (isDraggingWindow) {
      const deltaX = e.screenX - dragStartRef.current.screenX;
      if (Math.abs(deltaX) > 2) {
        moveWindow(deltaX);
        dragStartRef.current.screenX = e.screenX;
      }
    } else if (isDragging) {
      updateDrag(e.clientX, e.clientY);
    }
  }, [isDragging, isDraggingWindow, updateDrag, moveWindow]);

  const handleMouseUp = useCallback(() => {
    if (isDraggingWindow) {
      setIsDraggingWindow(false);
    } else if (isDragging) {
      const vx = velocityRef.current.x * 3;
      const vy = velocityRef.current.y * 3;
      endDrag(vx, vy);
    }
  }, [isDragging, isDraggingWindow, endDrag]);

  const handleRitual = useCallback(() => {
    if (!isDragging && !isDraggingWindow) {
      playSound(currentCharm.soundFile);
      applyImpulse((Math.random() - 0.5) * 100, -50);
    }
  }, [isDragging, isDraggingWindow, currentCharm.soundFile, playSound, applyImpulse]);

  const handleCharmSelect = useCallback((charm: CharmType, customEmoji?: string) => {
    setSelectedCharm(charm.id, customEmoji);
    applyImpulse(0, -100);
  }, [setSelectedCharm, applyImpulse]);

  // Anchor drag to move window
  const handleAnchorMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingWindow(true);
    dragStartRef.current = { x: e.clientX, screenX: e.screenX };
  }, []);

  const handleCharmMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  // Right-click anywhere opens picker
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsPickerOpen(true);
  }, []);

  const handleCharmClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging && !isDraggingWindow) {
      handleRitual();
    }
  }, [isDragging, isDraggingWindow, handleRitual]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.__TAURI__) {
      import('@tauri-apps/api/event').then(({ listen }) => {
        listen('tray-choose-charm', () => setIsPickerOpen(true));
        listen('tray-toggle-sound', () => toggleSound());
      });
    }
  }, [toggleSound]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'transparent',
        cursor: isDraggingWindow ? 'grabbing' : (isDragging ? 'grabbing' : 'default'),
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <svg
        width={WINDOW_WIDTH}
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {/* Rope */}
        <Rope
          anchorX={ANCHOR_X}
          anchorY={ANCHOR_Y}
          segments={segments}
          stretch={stretch}
        />

        {/* Anchor area - drag to move window horizontally */}
        <g
          style={{ cursor: isDraggingWindow ? 'grabbing' : 'grab' }}
          onMouseDown={handleAnchorMouseDown}
        >
          {/* Larger invisible hitbox for anchor */}
          <rect
            x={ANCHOR_X - 40}
            y={0}
            width={80}
            height={30}
            fill="rgba(0,0,0,0.01)"
          />
        </g>

        {/* Charm - drag to swing, click for ritual */}
        <g
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleCharmMouseDown}
          onClick={handleCharmClick}
        >
          <Charm
            charm={currentCharm}
            x={charmPosition.x}
            y={charmPosition.y}
            size={settings.charmSize}
            stretch={stretch}
            isDragging={isDragging}
            customEmoji={settings.customEmoji}
            onRitual={handleRitual}
          />
          {/* Hitbox */}
          <circle
            cx={charmPosition.x}
            cy={charmPosition.y}
            r={settings.charmSize * 0.9}
            fill="rgba(0,0,0,0.01)"
          />
        </g>
      </svg>

      <CharmPicker
        isOpen={isPickerOpen}
        selectedId={settings.selectedCharmId}
        customEmoji={settings.customEmoji}
        onSelect={handleCharmSelect}
        onClose={() => setIsPickerOpen(false)}
        anchorX={charmPosition.x}
        anchorY={charmPosition.y}
      />
    </div>
  );
}
