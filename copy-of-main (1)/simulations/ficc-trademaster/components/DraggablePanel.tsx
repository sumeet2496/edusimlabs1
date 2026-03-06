
import React, { useState, useRef, useEffect } from 'react';

interface DraggablePanelProps {
  title: string;
  children: React.ReactNode;
  initialPos?: { x: number, y: number };
  onClose?: () => void;
  width?: string;
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({ 
  title, children, initialPos = { x: 100, y: 100 }, onClose, width = "500px" 
}) => {
  const [pos, setPos] = useState(initialPos);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const handleMouseUp = () => isDragging.current = false;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pos]);

  return (
    <div 
      className="fixed z-50 shadow-2xl border-2 border-[#444] bg-black flex flex-col overflow-hidden"
      style={{ left: pos.x, top: pos.y, width }}
    >
      <div 
        onMouseDown={handleMouseDown} 
        className="h-6 bg-[#000080] px-2 flex items-center justify-between shrink-0 select-none cursor-move"
      >
        <span className="text-[10px] font-bold text-white tracking-widest uppercase">
          {title}
        </span>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-white hover:text-red-500 text-xs transition-colors p-1"
          >
            &times;
          </button>
        )}
      </div>
      <div className="flex-1 bg-black p-4">
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;
