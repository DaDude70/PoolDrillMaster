
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BallPalette } from './BallPalette';
import { ToolPalette } from './ToolPalette';
import { ProjectionMode } from './ProjectionMode';
import { CanvasHandler } from './CanvasHandler';
import { CanvasControls } from './CanvasControls';
import { BallCreator } from './BallCreator';
import { ShapeCreator } from './ShapeCreator';
import { TrainingAidCreator } from './TrainingAidCreator';
import { Monitor, Edit3 } from 'lucide-react';

export type Tool = 'select' | 'ball' | 'straightLine' | 'circle' | 'rectangle' | 'alignmentTool' | 'trainingAid';

export const BilliardEditor = () => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedBallNumber, setSelectedBallNumber] = useState(1);
  const [isProjectionMode, setIsProjectionMode] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStartPoint, setLineStartPoint] = useState<{x: number, y: number} | null>(null);

  // Canvas dimensions matching pool table proportions (9-foot table)
  const canvasWidth = 900;
  const canvasHeight = 450;

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = false;
  }, [activeTool, fabricCanvas]);

  const handleCanvasClick = (e: any) => {
    if (!fabricCanvas) return;

    const pointer = fabricCanvas.getPointer(e.e);
    
    if (activeTool === 'ball') {
      BallCreator.createBall(fabricCanvas, pointer.x, pointer.y, selectedBallNumber);
    } else if (activeTool === 'straightLine') {
      if (!isDrawingLine) {
        setLineStartPoint({ x: pointer.x, y: pointer.y });
        setIsDrawingLine(true);
      } else {
        ShapeCreator.createLine(fabricCanvas, lineStartPoint!.x, lineStartPoint!.y, pointer.x, pointer.y);
        setIsDrawingLine(false);
        setLineStartPoint(null);
      }
    } else if (activeTool === 'circle') {
      ShapeCreator.createCircle(fabricCanvas, pointer.x, pointer.y);
    } else if (activeTool === 'rectangle') {
      ShapeCreator.createRectangle(fabricCanvas, pointer.x, pointer.y);
    } else if (activeTool === 'alignmentTool') {
      TrainingAidCreator.createAlignmentTool(fabricCanvas, pointer.x, pointer.y);
    } else if (activeTool === 'trainingAid') {
      TrainingAidCreator.createTrainingAid(fabricCanvas, pointer.x, pointer.y);
    }
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:down', handleCanvasClick);

    return () => {
      fabricCanvas.off('mouse:down', handleCanvasClick);
    };
  }, [fabricCanvas, activeTool, selectedBallNumber, isDrawingLine, lineStartPoint]);

  if (isProjectionMode) {
    return (
      <ProjectionMode 
        canvas={fabricCanvas} 
        onExit={() => setIsProjectionMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Pool Training Drill Editor</h1>
          <div className="flex gap-2">
            <CanvasControls canvas={fabricCanvas} />
            <Button 
              onClick={() => setIsProjectionMode(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Project Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                Tools
              </h3>
              <ToolPalette activeTool={activeTool} onToolChange={setActiveTool} />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Balls</h3>
              <BallPalette 
                selectedNumber={selectedBallNumber}
                onNumberChange={setSelectedBallNumber}
              />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Instructions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Select a tool and click on the table</p>
                <p>• For straight lines: click start, then end point</p>
                <p>• Training aids help with alignment and practice</p>
                <p>• Use bright colors for projection visibility</p>
                <p>• Save your drills for later use</p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="p-4">
              <div className="flex justify-center">
                <CanvasHandler 
                  onCanvasReady={setFabricCanvas}
                  canvasWidth={canvasWidth}
                  canvasHeight={canvasHeight}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
