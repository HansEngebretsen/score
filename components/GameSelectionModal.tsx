
import React from 'react';
import { GameType } from '../types';

interface GameSelectionModalProps {
  activeType: GameType;
  onSelect: (type: GameType) => void;
  onClose: () => void;
}

const GameSelectionModal: React.FC<GameSelectionModalProps> = ({ activeType, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-magical-surface border border-magical-border rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl pop-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-magical-text mb-8 text-center">Select Game</h3>
        
        <div className="space-y-4">
          <button 
            onClick={() => onSelect('flip7')}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all group ${activeType === 'flip7' ? 'border-magical-accent bg-magical-surface2' : 'border-magical-border bg-transparent hover:border-magical-muted'}`}
          >
            <div className="flex flex-col items-start text-left">
              <span className={`text-lg font-bold ${activeType === 'flip7' ? 'text-magical-accent' : 'text-magical-text'}`}>Flip 7</span>
              <span className="text-xs text-magical-muted text-left">Claim the throne of glory by flipping all 7</span>
            </div>
            {activeType === 'flip7' && <span className="material-symbols-rounded text-magical-accent text-2xl">check_circle</span>}
          </button>

          <button 
            onClick={() => onSelect('thirteen')}
            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all group ${activeType === 'thirteen' ? 'border-white bg-magical-surface2' : 'border-magical-border bg-transparent hover:border-magical-muted'}`}
          >
            <div className="flex flex-col items-start text-left">
              <span className={`text-lg font-bold ${activeType === 'thirteen' ? 'text-white' : 'text-magical-text'}`}>Thirteen</span>
              <span className={`text-xs ${activeType === 'thirteen' ? 'text-white/80' : 'text-magical-muted'} text-left`}>triples and straights with the deck as wilds</span>
            </div>
            {activeType === 'thirteen' && <span className="material-symbols-rounded text-white text-2xl">check_circle</span>}
          </button>
        </div>
        
        <button className="w-full mt-8 py-3 text-magical-muted font-bold text-sm hover:text-magical-text transition-colors" onClick={onClose}>
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default GameSelectionModal;
