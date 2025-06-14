
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

    console.log('Canvas instance:', canvas);
    console.log('Canvas width:', canvas.width);
    console.log('Canvas height:', canvas.height);
    
    const objects = canvas.getObjects();
    console.log('Original canvas objects:', objects.length);
    console.log('Objects details:', objects.map(obj => ({ type: obj.type, left: obj.left, top: obj.top })));
    
    const projectionCanvas = new FabricCanvas(projectionCanvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#000000',
    });

    if (objects.length === 0) {
      console.log('No objects found on original canvas - showing empty projection');
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

    // Calculate scale factor to fit screen while maintaining aspect ratio
    const canvasWidth = canvas.width || 900;
    const canvasHeight = canvas.height || 450;
    const scaleX = window.innerWidth / canvasWidth;
    const scaleY = window.innerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY) * 0.8;

    console.log('Scale factors:', { scaleX, scaleY, finalScale: scale });

    // Calculate center position
    const centerX = (window.innerWidth - canvasWidth * scale) / 2;
    const centerY = (window.innerHeight - canvasHeight * scale) / 2;

    console.log('Center position:', { centerX, centerY });

    // Try a different approach - serialize and deserialize the canvas
    const canvasData = canvas.toObject();
    console.log('Canvas data:', canvasData);
    
    projectionCanvas.loadFromJSON(canvasData).then(() => {
      console.log('Canvas loaded from JSON successfully');
      
      // Now scale and position all objects
      const projectionObjects = projectionCanvas.getObjects();
      console.log('Projection canvas objects after loading:', projectionObjects.length);
      
      projectionObjects.forEach((obj, index) => {
        console.log(`Transforming object ${index}:`, obj.type);
        
        const newLeft = (obj.left || 0) * scale + centerX;
        const newTop = (obj.top || 0) * scale + centerY;
        const newScaleX = (obj.scaleX || 1) * scale;
        const newScaleY = (obj.scaleY || 1) * scale;
        
        obj.set({
          left: newLeft,
          top: newTop,
          scaleX: newScaleX,
          scaleY: newScaleY,
          selectable: false,
          evented: false,
        });
        
        console.log(`Object ${index} positioned at:`, { left: newLeft, top: newTop });
      });
      
      projectionCanvas.renderAll();
      console.log('Projection canvas rendered with', projectionObjects.length, 'objects');
    }).catch((error) => {
      console.error('Error loading canvas from JSON:', error);
      
      // Fallback: show error message
      const errorMessage = new Text('Error loading objects for projection', {
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
        fontSize: 24,
        fill: '#ff0000',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      projectionCanvas.add(errorMessage);
      projectionCanvas.renderAll();
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
