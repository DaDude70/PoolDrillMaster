
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Canvas as FabricCanvas, Text } from 'fabric';

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

    console.log('Creating projection canvas');
    
    const projectionCanvas = new FabricCanvas(projectionCanvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000000',
    });

    // Use a timeout to ensure canvas is fully rendered
    setTimeout(() => {
      // Force canvas to render first
      canvas.renderAll();
      
      // Get objects after render
      const objects = canvas.getObjects();
      console.log('Canvas objects found:', objects.length);
      
      if (objects.length === 0) {
        console.log('No objects found - showing message');
        const message = new Text('No objects to display\nAdd some balls or shapes first!', {
          left: window.innerWidth / 2,
          top: window.innerHeight / 2,
          fontSize: 32,
          fill: '#ffffff',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });
        projectionCanvas.add(message);
        projectionCanvas.renderAll();
        return;
      }

      // Export the canvas as JSON and import to projection canvas
      const canvasData = canvas.toObject();
      console.log('Canvas data:', canvasData);
      
      // Calculate scale to fit screen
      const canvasWidth = canvas.width || 900;
      const canvasHeight = canvas.height || 450;
      const scaleX = window.innerWidth / canvasWidth;
      const scaleY = window.innerHeight / canvasHeight;
      const scale = Math.min(scaleX, scaleY) * 0.8;
      
      // Calculate center position
      const centerX = (window.innerWidth - canvasWidth * scale) / 2;
      const centerY = (window.innerHeight - canvasHeight * scale) / 2;
      
      console.log('Scale and position:', { scale, centerX, centerY });
      
      // Apply scaling and positioning to all objects
      if (canvasData.objects) {
        canvasData.objects.forEach((obj: any) => {
          obj.left = (obj.left || 0) * scale + centerX;
          obj.top = (obj.top || 0) * scale + centerY;
          obj.scaleX = (obj.scaleX || 1) * scale;
          obj.scaleY = (obj.scaleY || 1) * scale;
          obj.selectable = false;
          obj.evented = false;
        });
      }
      
      // Load the scaled data into projection canvas
      projectionCanvas.loadFromJSON(canvasData, () => {
        console.log('Objects loaded into projection canvas');
        projectionCanvas.renderAll();
      });
      
    }, 100);

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
