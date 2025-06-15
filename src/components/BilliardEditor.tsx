
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BallPalette } from './BallPalette';
import { ToolPalette } from './ToolPalette';
import { DrillProjection } from './DrillProjection';
import { DrillManager } from './DrillManager';
import { SaveDrillDialog } from './SaveDrillDialog';
import { CanvasHandler } from './CanvasHandler';
import { CanvasControls } from './CanvasControls';
import { BallCreator } from './BallCreator';
import { ShapeCreator } from './ShapeCreator';
import { TrainingAidCreator } from './TrainingAidCreator';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { Monitor, Edit3, Save, FolderOpen, Undo, Redo } from 'lucide-react';
import { DrillData } from '@/types/drill';

export type Tool = 'select' | 'ball' | 'straightLine' | 'circle' | 'rectangle' | 'alignmentTool' | 'trainingAid';

export const BilliardEditor = () => {
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selectedBallNumber, setSelectedBallNumber] = useState(1);
  const [projectionDrill, setProjectionDrill] = useState<DrillData | null>(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStartPoint, setLineStartPoint] = useState<{x: number, y: number} | null>(null);
  const [previewLine, setPreviewLine] = useState<Line | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDrillManager, setShowDrillManager] = useState(false);
  
  const { saveState, undo, redo, canUndo, canRedo } = useCanvasHistory(fabricCanvas);

  // Canvas dimensions matching pool table proportions (9-foot table)
  const canvasWidth = 900;
  const canvasHeight = 450;

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = false;
  }, [activeTool, fabricCanvas]);

  // Save state after canvas modifications
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleObjectAdded = () => {
      setTimeout(saveState, 100); // Small delay to ensure object is fully added
    };

    const handleObjectRemoved = () => {
      setTimeout(saveState, 100);
    };

    fabricCanvas.on('object:added', handleObjectAdded);
    fabricCanvas.on('object:removed', handleObjectRemoved);

    return () => {
      fabricCanvas.off('object:added', handleObjectAdded);
      fabricCanvas.off('object:removed', handleObjectRemoved);
    };
  }, [fabricCanvas, saveState]);

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
        // Remove preview line
        if (previewLine) {
          fabricCanvas.remove(previewLine);
          setPreviewLine(null);
        }
        
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

  const handleCanvasMouseMove = (e: any) => {
    if (!fabricCanvas || !isDrawingLine || !lineStartPoint) return;

    const pointer = fabricCanvas.getPointer(e.e);
    
    // Remove existing preview line
    if (previewLine) {
      fabricCanvas.remove(previewLine);
    }

    // Create new preview line
    const newPreviewLine = new Line([lineStartPoint.x, lineStartPoint.y, pointer.x, pointer.y], {
      stroke: '#00ff00',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      opacity: 0.7
    });

    fabricCanvas.add(newPreviewLine);
    setPreviewLine(newPreviewLine);
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:down', handleCanvasClick);
    fabricCanvas.on('mouse:move', handleCanvasMouseMove);

    return () => {
      fabricCanvas.off('mouse:down', handleCanvasClick);
      fabricCanvas.off('mouse:move', handleCanvasMouseMove);
    };
  }, [fabricCanvas, activeTool, selectedBallNumber, isDrawingLine, lineStartPoint, previewLine]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleSelectDrill = (drill: DrillData) => {
    if (!fabricCanvas) return;
    
    fabricCanvas.loadFromJSON(drill.canvasData, () => {
      fabricCanvas.renderAll();
      saveState(); // Save initial state
    });
    setShowDrillManager(false);
  };

  const handleProjectDrill = (drill: DrillData) => {
    setProjectionDrill(drill);
    setShowDrillManager(false);
  };

  const handleNewDrill = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#8B0000';
    fabricCanvas.renderAll();
    saveState(); // Save initial state
    setShowDrillManager(false);
  };

  if (projectionDrill) {
    return (
      <DrillProjection 
        drill={projectionDrill}
        onExit={() => setProjectionDrill(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Pool Training Drill Editor</h1>
          <div className="flex gap-2">
            <Button 
              onClick={undo}
              disabled={!canUndo}
              variant="outline"
              size="sm"
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button 
              onClick={redo}
              disabled={!canRedo}
              variant="outline"
              size="sm"
            >
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Button 
              onClick={() => setShowSaveDialog(true)}
              variant="outline"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Drill
            </Button>
            <Button 
              onClick={() => setShowDrillManager(!showDrillManager)}
              variant="outline"
              size="sm"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Drill Library
            </Button>
            <CanvasControls canvas={fabricCanvas} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {showDrillManager ? (
              <DrillManager
                onSelectDrill={handleSelectDrill}
                onProjectDrill={handleProjectDrill}
                onNewDrill={handleNewDrill}
              />
            ) : (
              <>
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
                    <p>• Use Ctrl+Z/Ctrl+Y for undo/redo</p>
                    <p>• Save your drills to the library</p>
                    <p>• Project drills for teaching and practice</p>
                    <p>• Export/import drill collections</p>
                  </div>
                </Card>
              </>
            )}
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

      <SaveDrillDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        canvas={fabricCanvas}
      />
    </div>
  );
};
