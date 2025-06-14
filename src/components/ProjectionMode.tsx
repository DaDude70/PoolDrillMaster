
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Maximize, RotateCcw } from 'lucide-react';
import { Canvas as FabricCanvas } from 'fabric';

interface ProjectionModeProps {
  canvas: FabricCanvas | null;
  onExit: () => void;
}

export const ProjectionMode = ({ canvas, onExit }: ProjectionModeProps) => {
  const projectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState<'black' | 'white' | 'green'>('black');

  useEffect(() => {
    if (!canvas || !projectionCanvasRef.current) {
      console.log('Missing canvas or projection canvas ref');
      return;
    }

    const projectionCanvas = projectionCanvasRef.current;
    const projectionCtx = projectionCanvas.getContext('2d');
    
    if (!projectionCtx) {
      console.error('Could not get 2D context from projection canvas');
      return;
    }

    // Set projection canvas size to window size
    const updateCanvasSize = () => {
      projectionCanvas.width = window.innerWidth;
      projectionCanvas.height = window.innerHeight;
    };

    updateCanvasSize();

    // Get the source canvas element from Fabric.js
    const sourceCanvas = canvas.getElement();
    
    const mirrorCanvas = () => {
      if (!projectionCtx || !sourceCanvas) return;

      // Clear the projection canvas
      projectionCtx.fillStyle = backgroundColor;
      projectionCtx.fillRect(0, 0, projectionCanvas.width, projectionCanvas.height);

      // Check if source canvas has content
      const sourceWidth = sourceCanvas.width;
      const sourceHeight = sourceCanvas.height;
      
      if (sourceWidth === 0 || sourceHeight === 0) {
        // Show "no content" message
        projectionCtx.fillStyle = backgroundColor === 'black' ? '#ffffff' : '#000000';
        projectionCtx.font = '32px Arial';
        projectionCtx.textAlign = 'center';
        projectionCtx.fillText(
          'No objects to display',
          projectionCanvas.width / 2,
          projectionCanvas.height / 2 - 20
        );
        projectionCtx.font = '18px Arial';
        projectionCtx.fillText(
          'Add some balls or shapes to the table first!',
          projectionCanvas.width / 2,
          projectionCanvas.height / 2 + 20
        );
        return;
      }

      // Calculate scaling to fit the projection canvas while maintaining aspect ratio
      const scaleX = projectionCanvas.width / sourceWidth;
      const scaleY = projectionCanvas.height / sourceHeight;
      const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding

      // Calculate position to center the scaled canvas
      const scaledWidth = sourceWidth * scale;
      const scaledHeight = sourceHeight * scale;
      const x = (projectionCanvas.width - scaledWidth) / 2;
      const y = (projectionCanvas.height - scaledHeight) / 2;

      // Draw the source canvas onto the projection canvas
      try {
        projectionCtx.drawImage(
          sourceCanvas,
          0, 0, sourceWidth, sourceHeight,
          x, y, scaledWidth, scaledHeight
        );
      } catch (error) {
        console.error('Error drawing canvas:', error);
        // Fallback: show error message
        projectionCtx.fillStyle = backgroundColor === 'black' ? '#ffffff' : '#000000';
        projectionCtx.font = '24px Arial';
        projectionCtx.textAlign = 'center';
        projectionCtx.fillText(
          'Projection Error - Try refreshing',
          projectionCanvas.width / 2,
          projectionCanvas.height / 2
        );
      }

      // Continue mirroring
      animationFrameRef.current = requestAnimationFrame(mirrorCanvas);
    };

    // Start the mirroring process
    mirrorCanvas();

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas, backgroundColor]);

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
        ref={projectionCanvasRef}
        className="w-full h-full cursor-none"
        style={{ display: 'block' }}
      />
      
      <div className={`absolute bottom-4 left-4 text-sm ${backgroundColor === 'white' ? 'text-black' : 'text-white'}`}>
        <div>ESC: Exit • F: Fullscreen • B: Background</div>
        <div className="text-xs opacity-75 mt-1">Real-time canvas projection</div>
      </div>
    </div>
  );
};
