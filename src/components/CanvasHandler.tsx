
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface CanvasHandlerProps {
  onCanvasReady: (canvas: FabricCanvas) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const CanvasHandler = ({ onCanvasReady, canvasWidth, canvasHeight }: CanvasHandlerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#8B0000', // Dark red to simulate pool table felt
    });

    // Add keyboard event listener for delete
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    onCanvasReady(canvas);
    toast.success("Billiard table ready! Start creating your drill.");

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, [onCanvasReady, canvasWidth, canvasHeight]);

  return (
    <canvas 
      ref={canvasRef}
      className="border-2 border-gray-300 rounded-lg shadow-lg"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
