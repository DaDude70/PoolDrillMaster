
import { Rect, Circle, Line, Group } from 'fabric';
import { Canvas as FabricCanvas } from 'fabric';

export class TrainingAidCreator {
  static createAlignmentTool(canvas: FabricCanvas, x: number, y: number) {
    // Create a black alignment rail (about half table length)
    const railLength = 400; // About half the table width
    const railWidth = 30;
    
    const rail = new Rect({
      left: x - railLength / 2,
      top: y - railWidth / 2,
      width: railLength,
      height: railWidth,
      fill: '#2a2a2a',
      stroke: '#1a1a1a',
      strokeWidth: 2,
      rx: 15,
      ry: 15,
    });

    // Add white alignment circles along the rail
    const marks = [];
    const markSpacing = 50;
    for (let i = 0; i <= railLength; i += markSpacing) {
      const mark = new Circle({
        left: x - railLength / 2 + i - 4,
        top: y - 4,
        radius: 4,
        fill: '#ffffff',
        stroke: '#ffffff',
        strokeWidth: 1,
        lockUniScaling: true, // Ensure circles stay circular
      });
      marks.push(mark);
    }

    // Create a group with the rail and marks
    const alignmentTool = new Group([rail, ...marks], {
      left: x - railLength / 2,
      top: y - railWidth / 2,
    });

    canvas.add(alignmentTool);
  }

  static createTrainingAid(canvas: FabricCanvas, x: number, y: number) {
    // Create the main training aid body (similar to the blue tool in the image)
    const aidLength = 350;
    const aidWidth = 60;
    
    // Main body
    const body = new Rect({
      left: x - aidLength / 2,
      top: y - aidWidth / 2,
      width: aidLength,
      height: aidWidth,
      fill: '#1e40af',
      stroke: '#1e3a8a',
      strokeWidth: 2,
      rx: 30,
      ry: 30,
    });

    // Create target circles at strategic positions - these will maintain their shape
    const circles = [];
    const circlePositions = [-120, 0, 120]; // Relative to center
    
    circlePositions.forEach(pos => {
      // Outer circle - lockUniScaling prevents distortion
      const outerCircle = new Circle({
        left: x + pos - 20,
        top: y - 20,
        radius: 20,
        fill: 'transparent',
        stroke: '#ffffff',
        strokeWidth: 3,
        lockUniScaling: true, // Ensure circles stay circular
      });
      
      // Inner circle - lockUniScaling prevents distortion
      const innerCircle = new Circle({
        left: x + pos - 8,
        top: y - 8,
        radius: 8,
        fill: '#ffffff',
        stroke: '#1e40af',
        strokeWidth: 2,
        lockUniScaling: true, // Ensure circles stay circular
      });
      
      // Center dot - lockUniScaling prevents distortion
      const centerDot = new Circle({
        left: x + pos - 3,
        top: y - 3,
        radius: 3,
        fill: '#dc2626',
        stroke: '#dc2626',
        strokeWidth: 1,
        lockUniScaling: true, // Ensure circles stay circular
      });
      
      circles.push(outerCircle, innerCircle, centerDot);
    });

    // Add alignment lines
    const centerLine = new Line([x - aidLength / 2, y, x + aidLength / 2, y], {
      stroke: '#fbbf24',
      strokeWidth: 2,
      strokeDashArray: [10, 5],
    });

    // Create a group with all components
    const trainingAid = new Group([body, centerLine, ...circles], {
      left: x - aidLength / 2,
      top: y - aidWidth / 2,
    });

    canvas.add(trainingAid);
  }
}
