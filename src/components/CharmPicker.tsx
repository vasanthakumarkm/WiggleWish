import { useState, useEffect, useRef } from 'react';
import { CHARMS } from '../data/charms';
import { Charm } from '../types';

interface CharmPickerProps {
  isOpen: boolean;
  selectedId: string;
  customEmoji?: string;
  onSelect: (charm: Charm, customEmoji?: string) => void;
  onClose: () => void;
  anchorX: number;
  anchorY: number;
}

export function CharmPicker({
  isOpen,
  selectedId,
  customEmoji,
  onSelect,
  onClose,
}: CharmPickerProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmojiInput, setCustomEmojiInput] = useState(customEmoji || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setShowCustomInput(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCustomInput) {
          setShowCustomInput(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showCustomInput, onClose]);

  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  if (!isOpen) return null;

  const handleCharmSelect = (charm: Charm) => {
    if (charm.id === 'custom') {
      setShowCustomInput(true);
    } else {
      onSelect(charm);
      onClose();
    }
  };

  const handleCustomSubmit = () => {
    if (customEmojiInput.trim()) {
      const customCharm = CHARMS.find(c => c.id === 'custom')!;
      onSelect(customCharm, customEmojiInput.trim());
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 20, 30, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
        zIndex: 1000,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 220,
          marginBottom: 15,
          padding: '0 5px',
        }}
      >
        <h2 style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '0.5px',
        }}>
          Choose Charm
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 4,
            width: 24,
            height: 24,
            cursor: 'pointer',
            color: '#aaa',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>

      {showCustomInput ? (
        <div style={{
          padding: 15,
          width: '100%',
          maxWidth: 220,
        }}>
          <label
            htmlFor="custom-emoji-input"
            style={{
              display: 'block',
              marginBottom: 10,
              fontSize: 13,
              color: '#aaa'
            }}
          >
            Enter your lucky emoji:
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              id="custom-emoji-input"
              type="text"
              value={customEmojiInput}
              onChange={(e) => setCustomEmojiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCustomSubmit();
              }}
              placeholder="🌟"
              maxLength={4}
              style={{
                flex: 1,
                padding: '10px 12px',
                fontSize: 24,
                textAlign: 'center',
                border: '1px solid #444',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customEmojiInput.trim()}
              style={{
                padding: '10px 16px',
                backgroundColor: customEmojiInput.trim() ? '#4a7c59' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: customEmojiInput.trim() ? 'pointer' : 'not-allowed',
                fontWeight: 500,
                fontSize: 13,
              }}
            >
              Save
            </button>
          </div>
          <button
            onClick={() => setShowCustomInput(false)}
            style={{
              marginTop: 15,
              padding: '8px 12px',
              backgroundColor: 'transparent',
              color: '#888',
              border: '1px solid #444',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              width: '100%',
            }}
          >
            ← Back
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            padding: '0 10px',
            width: '100%',
            maxWidth: 230,
          }}
        >
          {CHARMS.map((charm) => (
            <button
              key={charm.id}
              onClick={() => handleCharmSelect(charm)}
              aria-label={`${charm.name}: ${charm.description}`}
              title={`${charm.name}\n${charm.culture}\n${charm.description}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
                backgroundColor: selectedId === charm.id
                  ? 'rgba(74, 124, 89, 0.4)'
                  : 'rgba(255,255,255,0.05)',
                border: selectedId === charm.id
                  ? '2px solid rgba(74, 124, 89, 0.8)'
                  : '2px solid transparent',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedId !== charm.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedId !== charm.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }
              }}
            >
              <span style={{ fontSize: 28, marginBottom: 4 }}>
                {charm.id === 'custom' && customEmoji ? customEmoji : charm.emoji}
              </span>
              <span style={{
                fontSize: 9,
                color: '#bbb',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {charm.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Tip */}
      <div style={{
        marginTop: 15,
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
      }}>
        Press ESC or click outside to close
      </div>
    </div>
  );
}
