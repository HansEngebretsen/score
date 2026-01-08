
import React, { useState } from 'react';
import { GameType } from '../types';

interface SettingsModalProps {
  gameType: GameType;
  targetScore: number;
  reorderEnabled: boolean;
  onSave: (targetScore: number, reorderEnabled: boolean) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ gameType, targetScore, reorderEnabled, onSave, onClose }) => {
  const [val, setVal] = useState(targetScore);
  const [reorder, setReorder] = useState(reorderEnabled);

  const isThirteen = gameType === 'thirteen';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="bg-magical-surface border border-magical-border rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl pop-in">
        <h3 className="text-2xl font-bold text-magical-text mb-8 flex items-center gap-3">
          <span className="material-symbols-rounded" style={isThirteen ? { color: 'var(--border)' } : { color: 'var(--accent)' }}>settings</span>
        </h3>

        <div className="space-y-8">
          {/* Target Score Slider - Only for Flip 7 */}
          {!isThirteen && (
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="text-xs font-bold text-magical-muted uppercase tracking-wider">Target Score</label>
                <span className="text-5xl font-mono font-bold text-magical-accent drop-shadow-sm">{val}</span>
              </div>
              <div className="relative h-12 flex items-center">
                <input
                  className="w-full z-10 relative cursor-pointer"
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={val}
                  onChange={(e) => setVal(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Reorder Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-magical-text">Auto-reorder Columns</span>
              <span className="text-[0.7rem] text-magical-text">Reorder by leader after each round</span>
            </div>
            <button
              onClick={() => setReorder(!reorder)}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
              style={reorder ? (isThirteen ? { backgroundColor: 'var(--border)' } : { backgroundColor: 'var(--accent)' }) : { backgroundColor: 'var(--bg-surface-2)' }}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reorder ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <button
          className="w-full mt-10 py-4 rounded-2xl text-white font-bold text-sm tracking-wide shadow-xl active:scale-[0.98] transition-transform"
          style={isThirteen ? { backgroundColor: 'var(--border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : { backgroundColor: 'var(--accent)', boxShadow: '0 20px 25px -5px var(--accent), 0 10px 10px -5px var(--accent)' }}
          onClick={() => onSave(val, reorder)}
        >
          DONE
        </button>
      </div>
      <style>{`
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none; height: 24px; width: 24px; border-radius: 50%;
            background: var(--accent); margin-top: -10px; border: 2px solid var(--bg-surface);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%; height: 6px; background: var(--bg-surface-2); border-radius: 999px;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;
