
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Canvas as FabricCanvas } from 'fabric';

interface ProjectionModeProps {
  canvas: FabricCanvas | null;
  onExit: () => void;
}

export const ProjectionMode = ({ canvas, onExit }: ProjectionModeProps) => {
  const projectionCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas || !projectionCanvasRef.current) return;

    const projectionCanvas = new FabricCanvas(projectionCanvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000000', // Black background for projection
    });

    // Get the canvas data and clone it properly
    const canvasData = canvas.toJSON();
    
    // Calculate scale factor to fit screen while maintaining aspect ratio
    const canvasWidth = canvas.width || 900;
    const canvasHeight = canvas.height || 450;
    const scaleX = window.innerWidth / canvasWidth;
    const scaleY = window.innerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9; // Use 90% of available space

    // Calculate center position
    const centerX = (window.innerWidth - canvasWidth * scale) / 2;
    const centerY = (window.innerHeight - canvasHeight * scale) / 2;

    // Load the canvas data
    projectionCanvas.loadFromJSON(canvasData, () => {
      // Scale and position all objects
      projectionCanvas.getObjects().forEach(obj => {
        if (obj.left !== undefined && obj.top !== undefined) {
          obj.set({
            left: obj.left * scale + centerX,
            top: obj.top * scale + centerY,
            scaleX: (obj.scaleX || 1) * scale,
            scaleY: (obj.scaleY || 1) * scale,
            selectable: false,
            evented: false,
          });
        }
      });

      projectionCanvas.renderAll();
      console.log('Projection canvas loaded with objects:', projectionCanvas.getObjects().length);
    });

    // Handle escape key
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      projectionCanvas.dispose();
    };
  }, [canvas, onExit]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Button
        onClick={onExit}
        className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700"
        size="sm"
      >
        <X className="w-4 h-4 mr-2" />
        Exit Projection
      </Button>
      
      <canvas 
        ref={projectionCanvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      <div className="absolute bottom-4 left-4 text-white text-sm">
        Press ESC to exit projection mode
      </div>
    </div>
  );
};
