
import React from 'react';
import { Button } from '@/components/ui/button';

interface BallPaletteProps {
  selectedNumber: number;
  onNumberChange: (number: number) => void;
}

export const BallPalette = ({ selectedNumber, onNumberChange }: BallPaletteProps) => {
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
    { number: 9, color: '#FFFF00' }, // Yellow stripe
    { number: 10, color: '#0066FF' }, // Blue stripe
    { number: 11, color: '#FF0000' }, // Red stripe
    { number: 12, color: '#800080' }, // Purple stripe
    { number: 13, color: '#FF8C00' }, // Orange stripe
    { number: 14, color: '#006400' }, // Green stripe
    { number: 15, color: '#8B0000' }, // Maroon stripe
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Cue Ball</h4>
        <Button
          variant={selectedNumber === 0 ? "default" : "outline"}
          size="sm"
          onClick={() => onNumberChange(0)}
          className="h-12 w-12 p-0 rounded-full bg-white border-2 border-gray-300 text-black font-bold"
        >
          CUE
        </Button>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Solid Balls (1-7)</h4>
        <div className="grid grid-cols-4 gap-2">
          {solidBalls.map((number, index) => (
            <Button
              key={number}
              variant={selectedNumber === number ? "default" : "outline"}
              size="sm"
              onClick={() => onNumberChange(number)}
              className="h-12 w-12 p-0 rounded-full relative border-2 border-gray-800 font-bold text-sm text-white"
              style={{
                backgroundColor: solidColors[index]
              }}
            >
              {number}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Stripe Balls (9-15)</h4>
        <div className="grid grid-cols-4 gap-2">
          {stripeBallsData.map((ball, index) => (
            <Button
              key={ball.number}
              variant={selectedNumber === (index + 9) ? "default" : "outline"}
              size="sm"
              onClick={() => onNumberChange(index + 9)}
              className="h-12 w-12 p-0 rounded-full relative border-2 border-gray-800 font-bold text-sm text-white"
              style={{
                background: `linear-gradient(180deg, white 20%, ${ball.color} 20%, ${ball.color} 80%, white 80%)`
              }}
            >
              {ball.number}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">8-Ball</h4>
        <Button
          variant={selectedNumber === 8 ? "default" : "outline"}
          size="sm"
          onClick={() => onNumberChange(8)}
          className="h-12 w-12 p-0 rounded-full bg-black text-white border-2 border-gray-800 font-bold"
        >
          8
        </Button>
      </div>
    </div>
  );
};
