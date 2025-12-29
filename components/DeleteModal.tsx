
import React from 'react';

interface DeleteModalProps {
  type: 'game' | 'player';
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ type, name, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="bg-magical-surface border border-magical-border rounded-[2rem] p-6 w-full max-w-xs shadow-2xl pop-in">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4 animate-bounce-sm">
          <span className="material-symbols-rounded text-rose-500 text-3xl">delete_forever</span>
        </div>
        <h3 className="text-xl font-bold text-magical-text mb-2 text-center">
            {type === 'game' ? "Delete Game?" : "Remove Player?"}
        </h3>
        <p className="text-magical-muted text-sm mb-6 text-center leading-relaxed">
          Poof! Gone forever? Permanently delete <span className="font-bold text-magical-accent">{name}</span>?
        </p>
        <div className="flex gap-3">
          <button 
            className="flex-1 py-3.5 rounded-2xl bg-magical-surface2 text-magical-muted font-bold text-xs tracking-wide hover:brightness-110 transition-all" 
            onClick={onCancel}
          >
            NO, KEEP IT
          </button>
          <button 
            className="flex-1 py-3.5 rounded-2xl bg-rose-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all"
            onClick={onConfirm}
          >
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
