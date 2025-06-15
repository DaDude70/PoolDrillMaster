
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export const useCanvasHistory = (canvas: FabricCanvas | null) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const saveState = useCallback(() => {
    if (!canvas) return;
    
    const state = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(state);
      return newHistory.slice(-20); // Keep only last 20 states
    });
    setCurrentIndex(prev => Math.min(prev + 1, 19));
  }, [canvas, currentIndex]);

  const undo = useCallback(() => {
    if (!canvas || currentIndex <= 0) return;
    
    const newIndex = currentIndex - 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      setCurrentIndex(newIndex);
    });
  }, [canvas, currentIndex, history]);

  const redo = useCallback(() => {
    if (!canvas || currentIndex >= history.length - 1) return;
    
    const newIndex = currentIndex + 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      setCurrentIndex(newIndex);
    });
  }, [canvas, currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return { saveState, undo, redo, canUndo, canRedo };
};
