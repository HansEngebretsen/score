
import React, { useState } from 'react';

interface SettingsModalProps {
  targetScore: number;
  reorderEnabled: boolean;
  onSave: (targetScore: number, reorderEnabled: boolean) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ targetScore, reorderEnabled, onSave, onClose }) => {
  const [val, setVal] = useState(targetScore);
  const [reorder, setReorder] = useState(reorderEnabled);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="bg-magical-surface border border-magical-border rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl pop-in">
        <h3 className="text-2xl font-bold text-magical-text mb-8 flex items-center gap-3">
          <span className="material-symbols-rounded text-magical-accent">settings</span> Rules
        </h3>
        
        <div className="space-y-8">
          {/* Target Score Slider */}
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

          {/* Reorder Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-magical-text">Auto-reorder Columns</span>
              <span className="text-[0.7rem] text-magical-muted">Reorder by leader after each round</span>
            </div>
            <button 
              onClick={() => setReorder(!reorder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${reorder ? 'bg-magical-accent' : 'bg-magical-surface2'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reorder ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <button 
          className="w-full mt-10 py-4 rounded-2xl bg-magical-accent text-white font-bold text-sm tracking-wide shadow-xl shadow-magical-accent/30 active:scale-[0.98] transition-transform"
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
