import React from 'react';
import { GameType } from '../types';
import { LOGO_URL, THIRTEEN_LOGO_LARGE } from '../constants';

interface GameSelectionModalProps {
  activeType: GameType;
  onSelect: (type: GameType) => void;
  onClose: () => void;
}

const GameSelectionModal: React.FC<GameSelectionModalProps> = ({ activeType, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl pop-in flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        {/* Flip 7 Half */}
        <button 
          onClick={() => onSelect('flip7')}
          className="relative w-full h-48 bg-[#2e1065] flex items-center justify-center p-8 transition-transform active:scale-95 hover:brightness-110"
        >
          <img 
            src={LOGO_URL} 
            alt="Flip 7" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          {activeType === 'flip7' && (
             <div className="absolute top-4 right-4 bg-white/20 p-1 rounded-full backdrop-blur-sm">
                <span className="material-symbols-rounded text-white text-xl">check</span>
             </div>
          )}
        </button>

        {/* 13 Half */}
        <button 
          onClick={() => onSelect('thirteen')}
          className="relative w-full h-48 bg-[#f1e7ca] flex items-center justify-center p-8 transition-transform active:scale-95 hover:brightness-95"
        >
           <img 
            src={THIRTEEN_LOGO_LARGE} 
            alt="Thirteen" 
            className="w-full h-full object-contain"
          />
           {activeType === 'thirteen' && (
             <div className="absolute top-4 right-4 bg-black/10 p-1 rounded-full backdrop-blur-sm">
                <span className="material-symbols-rounded text-[#444441] text-xl">check</span>
             </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default GameSelectionModal;