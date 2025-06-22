
import { Rect, Circle, Line, Group, Polygon } from 'fabric';
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

  static createTrainingAidFourCircles(canvas: FabricCanvas, x: number, y: number) {
    const aidLength = 400;
    const aidWidth = 60;
    
    // Main body
    const body = new Rect({
      left: x - aidLength / 2,
      top: y - aidWidth / 2,
      width: aidLength,
      height: aidWidth,
      fill: '#059669',
      stroke: '#047857',
      strokeWidth: 2,
      rx: 30,
      ry: 30,
    });

    // Create target circles at four positions
    const circles = [];
    const circlePositions = [-150, -50, 50, 150]; // Four evenly spaced positions
    
    circlePositions.forEach(pos => {
      // Outer circle
      const outerCircle = new Circle({
        left: x + pos - 18,
        top: y - 18,
        radius: 18,
        fill: 'transparent',
        stroke: '#ffffff',
        strokeWidth: 3,
        lockUniScaling: true,
      });
      
      // Inner circle
      const innerCircle = new Circle({
        left: x + pos - 8,
        top: y - 8,
        radius: 8,
        fill: '#ffffff',
        stroke: '#059669',
        strokeWidth: 2,
        lockUniScaling: true,
      });
      
      // Center dot
      const centerDot = new Circle({
        left: x + pos - 3,
        top: y - 3,
        radius: 3,
        fill: '#dc2626',
        stroke: '#dc2626',
        strokeWidth: 1,
        lockUniScaling: true,
      });
      
      circles.push(outerCircle, innerCircle, centerDot);
    });

    // Add alignment lines
    const centerLine = new Line([x - aidLength / 2, y, x + aidLength / 2, y], {
      stroke: '#fbbf24',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
    });

    // Create a group with all components
    const trainingAid = new Group([body, centerLine, ...circles], {
      left: x - aidLength / 2,
      top: y - aidWidth / 2,
    });

    canvas.add(trainingAid);
  }

  static createTrainingAidFiveCircles(canvas: FabricCanvas, x: number, y: number) {
    const aidLength = 450;
    const aidWidth = 60;
    
    // Main body
    const body = new Rect({
      left: x - aidLength / 2,
      top: y - aidWidth / 2,
      width: aidLength,
      height: aidWidth,
      fill: '#7c3aed',
      stroke: '#6d28d9',
      strokeWidth: 2,
      rx: 30,
      ry: 30,
    });

    // Create target circles at five positions
    const circles = [];
    const circlePositions = [-180, -90, 0, 90, 180]; // Five evenly spaced positions
    
    circlePositions.forEach(pos => {
      // Outer circle
      const outerCircle = new Circle({
        left: x + pos - 16,
        top: y - 16,
        radius: 16,
        fill: 'transparent',
        stroke: '#ffffff',
        strokeWidth: 3,
        lockUniScaling: true,
      });
      
      // Inner circle
      const innerCircle = new Circle({
        left: x + pos - 7,
        top: y - 7,
        radius: 7,
        fill: '#ffffff',
        stroke: '#7c3aed',
        strokeWidth: 2,
        lockUniScaling: true,
      });
      
      // Center dot
      const centerDot = new Circle({
        left: x + pos - 2,
        top: y - 2,
        radius: 2,
        fill: '#dc2626',
        stroke: '#dc2626',
        strokeWidth: 1,
        lockUniScaling: true,
      });
      
      circles.push(outerCircle, innerCircle, centerDot);
    });

    // Add alignment lines
    const centerLine = new Line([x - aidLength / 2, y, x + aidLength / 2, y], {
      stroke: '#fbbf24',
      strokeWidth: 2,
      strokeDashArray: [6, 3],
    });

    // Create a group with all components
    const trainingAid = new Group([body, centerLine, ...circles], {
      left: x - aidLength / 2,
      top: y - aidWidth / 2,
    });

    canvas.add(trainingAid);
  }

  static createTargetCircle(canvas: FabricCanvas, x: number, y: number) {
    // Create a target with 3 concentric areas - each 2 inches broad
    // Assuming 1 inch = 24 pixels for pool table scale
    const inchToPixels = 24;
    const ringWidth = 2 * inchToPixels; // 2 inches = 48 pixels
    
    const circles = [];
    
    // Bulls eye (innermost) - 2 inch radius
    const bullsEye = new Circle({
      left: x - ringWidth,
      top: y - ringWidth,
      radius: ringWidth,
      fill: '#dc2626', // Red center
      stroke: '#991b1b',
      strokeWidth: 2,
      lockUniScaling: true,
    });
    
    // Middle ring - 4 inch radius
    const middleRing = new Circle({
      left: x - (ringWidth * 2),
      top: y - (ringWidth * 2),
      radius: ringWidth * 2,
      fill: '#fbbf24', // Yellow middle
      stroke: '#f59e0b',
      strokeWidth: 2,
      lockUniScaling: true,
    });
    
    // Outer ring - 6 inch radius
    const outerRing = new Circle({
      left: x - (ringWidth * 3),
      top: y - (ringWidth * 3),
      radius: ringWidth * 3,
      fill: '#10b981', // Green outer
      stroke: '#059669',
      strokeWidth: 2,
      lockUniScaling: true,
    });
    
    // Create the target as a group (outer first, then middle, then bulls eye for proper layering)
    const target = new Group([outerRing, middleRing, bullsEye], {
      left: x - (ringWidth * 3),
      top: y - (ringWidth * 3),
    });

    canvas.add(target);
  }

  static createBallNumber(canvas: FabricCanvas, x: number, y: number, number: number) {
    // Create a ball number marker for the table
    const numberSize = 30;
    
    // Background circle
    const background = new Circle({
      left: x - numberSize / 2,
      top: y - numberSize / 2,
      radius: numberSize / 2,
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      lockUniScaling: true,
    });
    
    // Number text
    const text = new Text(number.toString(), {
      left: x - (number > 9 ? 12 : 8),
      top: y - 10,
      fontSize: 18,
      fill: '#000000',
      fontFamily: 'Arial Black',
      fontWeight: 'bold',
      textAlign: 'center',
      selectable: false,
      evented: false,
    });
    
    // Create group
    const ballNumber = new Group([background, text], {
      left: x - numberSize / 2,
      top: y - numberSize / 2,
    });

    canvas.add(ballNumber);
  }
}
