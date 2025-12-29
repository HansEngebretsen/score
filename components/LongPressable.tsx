
import React, { useRef, useState, useCallback } from 'react';

interface LongPressableProps {
  onLongPress: () => void;
  onClick?: () => void;
  children: React.ReactNode;
}

const LongPressable: React.FC<LongPressableProps> = ({ onLongPress, onClick, children }) => {
  const timerRef = useRef<number | null>(null);
  const [isMoved, setIsMoved] = useState(false);

  const start = useCallback(() => {
    setIsMoved(false);
    timerRef.current = window.setTimeout(() => {
      if (!isMoved) {
        onLongPress();
      }
    }, 600);
  }, [onLongPress, isMoved]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return (
    <div
      onMouseDown={start}
      onMouseUp={clear}
      onMouseLeave={clear}
      onTouchStart={start}
      onTouchEnd={clear}
      onTouchMove={() => setIsMoved(true)}
      onClick={(e) => {
          if (!isMoved && onClick) onClick();
      }}
      className="contents"
    >
      {children}
    </div>
  );
};

export default LongPressable;
