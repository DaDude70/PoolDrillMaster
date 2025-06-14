
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Maximize, RotateCcw } from 'lucide-react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrillData } from '@/types/drill';

interface DrillProjectionProps {
  drill: DrillData;
  onExit: () => void;
}

export const DrillProjection = ({ drill, onExit }: DrillProjectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<'black' | 'white' | 'green'>('black');

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create a new canvas for projection
    const projectionCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#8B0000', // Pool table color
    });

    fabricCanvasRef.current = projectionCanvas;

    // Load the drill data
    if (drill.canvasData) {
      projectionCanvas.loadFromJSON(drill.canvasData, () => {
        projectionCanvas.renderAll();
        
        // Scale to fit the projection screen
        const objects = projectionCanvas.getObjects();
        if (objects.length > 0) {
          const group = new fabric.Group(objects);
          const bounds = group.getBoundingRect();
          
          // Calculate scale to fit screen with padding
          const scaleX = (window.innerWidth * 0.9) / bounds.width;
          const scaleY = (window.innerHeight * 0.9) / bounds.height;
          const scale = Math.min(scaleX, scaleY);
          
          // Center and scale all objects
          objects.forEach(obj => {
            obj.scaleX = (obj.scaleX || 1) * scale;
            obj.scaleY = (obj.scaleY || 1) * scale;
            obj.left = (obj.left - bounds.left) * scale + (window.innerWidth - bounds.width * scale) / 2;
            obj.top = (obj.top - bounds.top) * scale + (window.innerHeight - bounds.height * scale) / 2;
          });
          
          projectionCanvas.renderAll();
        }
      });
    }

    const handleResize = () => {
      projectionCanvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      projectionCanvas.dispose();
    };
  }, [drill]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      const bgColor = backgroundColor === 'black' ? '#000000' : 
                     backgroundColor === 'white' ? '#ffffff' : '#1f4e3d';
      fabricCanvasRef.current.backgroundColor = bgColor;
      fabricCanvasRef.current.renderAll();
    }
  }, [backgroundColor]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'b' || e.key === 'B') {
        setBackgroundColor(prev => 
          prev === 'black' ? 'white' : prev === 'white' ? 'green' : 'black'
        );
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onExit]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case 'white': return 'bg-white';
      case 'green': return 'bg-green-800';
      default: return 'bg-black';
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${getBackgroundClass()}`}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={() => setBackgroundColor(prev => 
            prev === 'black' ? 'white' : prev === 'white' ? 'green' : 'black'
          )}
          className="bg-gray-600 hover:bg-gray-700 text-white"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {backgroundColor === 'black' ? 'Black' : backgroundColor === 'white' ? 'White' : 'Green'}
        </Button>
        
        <Button
          onClick={toggleFullscreen}
          className="bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <Maximize className="w-4 h-4 mr-2" />
          {isFullscreen ? 'Exit' : 'Full'} Screen
        </Button>
        
        <Button
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Exit
        </Button>
      </div>
      
      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-none"
        style={{ display: 'block' }}
      />
      
      <div className={`absolute bottom-4 left-4 text-sm ${backgroundColor === 'white' ? 'text-black' : 'text-white'}`}>
        <div className="font-medium">{drill.name}</div>
        <div className="text-xs opacity-75">{drill.description}</div>
        <div className="text-xs opacity-50 mt-2">ESC: Exit • F: Fullscreen • B: Background</div>
      </div>
    </div>
  );
};
