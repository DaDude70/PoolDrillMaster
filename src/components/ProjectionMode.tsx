
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
    if (!canvas || !projectionCanvasRef.current) {
      console.log('Missing canvas or canvas ref');
      return;
    }

    console.log('Original canvas objects:', canvas.getObjects().length);
    
    const projectionCanvas = new FabricCanvas(projectionCanvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000000',
    });

    // Get all objects from the original canvas
    const objects = canvas.getObjects();
    console.log('Objects to clone:', objects.length);

    if (objects.length === 0) {
      console.log('No objects found on original canvas');
      projectionCanvas.renderAll();
      return;
    }

    // Calculate scale factor to fit screen while maintaining aspect ratio
    const canvasWidth = canvas.width || 900;
    const canvasHeight = canvas.height || 450;
    const scaleX = window.innerWidth / canvasWidth;
    const scaleY = window.innerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY) * 0.8; // Use 80% of available space

    // Calculate center position
    const centerX = (window.innerWidth - canvasWidth * scale) / 2;
    const centerY = (window.innerHeight - canvasHeight * scale) / 2;

    // Clone each object individually
    objects.forEach((obj, index) => {
      obj.clone().then((clonedObj: any) => {
        console.log(`Cloning object ${index}:`, clonedObj.type);
        
        // Scale and position the cloned object
        clonedObj.set({
          left: (clonedObj.left || 0) * scale + centerX,
          top: (clonedObj.top || 0) * scale + centerY,
          scaleX: (clonedObj.scaleX || 1) * scale,
          scaleY: (clonedObj.scaleY || 1) * scale,
          selectable: false,
          evented: false,
        });

        projectionCanvas.add(clonedObj);
        projectionCanvas.renderAll();
        console.log('Added object to projection canvas');
      }).catch((error: any) => {
        console.error('Error cloning object:', error);
      });
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
