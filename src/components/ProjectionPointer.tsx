
import React, { useState, useEffect } from 'react';

interface ProjectionPointerProps {
  isVisible: boolean;
}

export const ProjectionPointer = ({ isVisible }: ProjectionPointerProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x - 10,
        top: position.y - 10,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
    </div>
  );
};
