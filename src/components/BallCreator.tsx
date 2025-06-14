
import { Circle, Text, Group, Pattern, Shadow } from 'fabric';
import { Canvas as FabricCanvas } from 'fabric';

export class BallCreator {
  static createBall(canvas: FabricCanvas, x: number, y: number, ballNumber: number) {
    const ballRadius = 12;
    let ballColor = '#FFFFFF';
    let strokeColor = '#000000';
    let ballText = '';

    if (ballNumber === 0) {
      // Cue ball
      ballColor = '#FFFFFF';
      ballText = '';
    } else if (ballNumber >= 1 && ballNumber <= 7) {
      // Solid balls
      const solidColors = ['#FFFF00', '#0066FF', '#FF0000', '#800080', '#FF8C00', '#006400', '#8B0000'];
      ballColor = solidColors[ballNumber - 1];
      ballText = ballNumber.toString();
    } else if (ballNumber === 8) {
      // 8-ball
      ballColor = '#000000';
      ballText = '8';
    } else if (ballNumber >= 9 && ballNumber <= 15) {
      // Stripe balls
      const stripeColors = ['#FFFF00', '#0066FF', '#FF0000', '#800080', '#FF8C00', '#006400', '#8B0000'];
      const stripeIndex = ballNumber - 9;
      ballColor = '#FFFFFF';
      strokeColor = stripeColors[stripeIndex];
      ballText = ballNumber.toString();
    }

    const ball = new Circle({
      left: x - ballRadius,
      top: y - ballRadius,
      radius: ballRadius,
      fill: ballColor,
      stroke: strokeColor,
      strokeWidth: 2,
    });

    // Add stripe pattern for stripe balls
    if (ballNumber >= 9 && ballNumber <= 15) {
      const stripeColors = ['#FFFF00', '#0066FF', '#FF0000', '#800080', '#FF8C00', '#006400', '#8B0000'];
      const stripeIndex = ballNumber - 9;
      const stripeColor = stripeColors[stripeIndex];
      
      ball.set({
        fill: new Pattern({
          source: this.createStripePattern(stripeColor),
          repeat: 'repeat'
        })
      });
    }

    if (ballText) {
      const text = new Text(ballText, {
        left: x - (ballText.length > 1 ? 8 : 5), // Better centering for 1 vs 2 digit numbers
        top: y - 8,
        fontSize: 14,
        fill: '#FFFFFF', // White text for all balls
        fontFamily: 'Arial Black',
        fontWeight: 'bold',
        textAlign: 'center',
        selectable: false,
        evented: false,
        shadow: new Shadow({
          color: '#000000',
          blur: 1,
          offsetX: 1,
          offsetY: 1
        }),
      });
      
      const group = new Group([ball, text], {
        left: x - ballRadius,
        top: y - ballRadius,
      });
      
      canvas.add(group);
    } else {
      canvas.add(ball);
    }
  }

  private static createStripePattern(color: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 24, 24);
    
    // Colored stripe with larger middle area (60% of the ball)
    ctx.fillStyle = color;
    ctx.fillRect(0, 5, 24, 14); // Larger middle stripe
    
    return canvas;
  }
}
