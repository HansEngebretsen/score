import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                onClose();
            }, 300); // Match animation duration
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div
            className={`fixed bottom-[calc(6rem+var(--safe-bottom))] left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 ${isExiting ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'
                }`}
            style={{
                animation: isExiting ? 'none' : 'slideUp 0.3s ease-out'
            }}
        >
            <div className="bg-magical-text rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3 max-w-sm">
                <span className="material-symbols-rounded text-magical-bg text-xl">check_circle</span>
                <p className="text-sm font-medium text-magical-bg">{message}</p>
            </div>
            <style>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default Toast;
