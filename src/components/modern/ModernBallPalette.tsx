
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModernBallPaletteProps {
  selectedNumber: number;
  onNumberChange: (number: number) => void;
}

export const ModernBallPalette = ({ selectedNumber, onNumberChange }: ModernBallPaletteProps) => {
  const solidBalls = [1, 2, 3, 4, 5, 6, 7];
  const stripeBalls = [9, 10, 11, 12, 13, 14, 15];
  
  const solidColors = [
    '#FFFF00', // 1 - Yellow
    '#0066FF', // 2 - Blue  
    '#FF0000', // 3 - Red
    '#800080', // 4 - Purple
    '#FF8C00', // 5 - Orange
    '#006400', // 6 - Green
    '#8B0000', // 7 - Maroon
  ];

  const stripeBallsData = [
    { number: 9, color: '#FFFF00' },
    { number: 10, color: '#0066FF' },
    { number: 11, color: '#FF0000' },
    { number: 12, color: '#800080' },
    { number: 13, color: '#FF8C00' },
    { number: 14, color: '#006400' },
    { number: 15, color: '#8B0000' },
  ];

  const BallButton = ({ 
    number, 
    color, 
    isStripe = false, 
    isCue = false,
    isEightBall = false 
  }: {
    number: number;
    color?: string;
    isStripe?: boolean;
    isCue?: boolean;
    isEightBall?: boolean;
  }) => {
    const isSelected = selectedNumber === number;
    
    return (
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={() => onNumberChange(number)}
        className={`h-14 w-14 p-0 rounded-full relative border-2 font-bold text-sm transition-all duration-200 ${
          isSelected 
            ? 'scale-110 shadow-lg ring-2 ring-primary/50' 
            : 'hover:scale-105 hover:shadow-md'
        } ${
          isCue 
            ? 'bg-white border-gray-400 text-black shadow-inner' 
            : isEightBall
            ? 'bg-black text-white border-gray-600 shadow-inner'
            : 'border-gray-700 text-white shadow-inner'
        }`}
        style={
          !isCue && !isEightBall
            ? isStripe
              ? {
                  background: `linear-gradient(180deg, white 20%, ${color} 20%, ${color} 80%, white 80%)`,
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
                }
              : {
                  backgroundColor: color,
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
                }
            : isCue
            ? {
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.2)'
              }
            : {
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.3)'
              }
        }
      >
        {isCue ? 'CUE' : number}
      </Button>
    );
  };

  return (
    <Card className="bg-background/60 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          🎱 Ball Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Cue Ball</h4>
          <div className="flex justify-center">
            <BallButton number={0} isCue />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Solid Balls (1-7)</h4>
          <div className="grid grid-cols-4 gap-3">
            {solidBalls.map((number, index) => (
              <BallButton
                key={number}
                number={number}
                color={solidColors[index]}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">8-Ball</h4>
          <div className="flex justify-center">
            <BallButton number={8} isEightBall />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Stripe Balls (9-15)</h4>
          <div className="grid grid-cols-4 gap-3">
            {stripeBallsData.map((ball, index) => (
              <BallButton
                key={ball.number}
                number={ball.number}
                color={ball.color}
                isStripe
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
