
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
    '#0000FF', // 2 - Blue  
    '#FF0000', // 3 - Red
    '#800080', // 4 - Purple
    '#FFA500', // 5 - Orange
    '#008000', // 6 - Green
    '#800000', // 7 - Maroon
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Solid Balls (1-7)</h4>
        <div className="grid grid-cols-4 gap-2">
          {solidBalls.map((number, index) => (
            <Button
              key={number}
              variant={selectedNumber === number ? "default" : "outline"}
              size="sm"
              onClick={() => onNumberChange(number)}
              className="h-10 w-10 p-0 rounded-full relative"
              style={{
                backgroundColor: selectedNumber === number ? solidColors[index] : 'transparent',
                borderColor: solidColors[index],
                color: selectedNumber === number ? 
                  (solidColors[index] === '#FFFF00' || solidColors[index] === '#FFA500' ? '#000' : '#fff') : 
                  solidColors[index]
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
          {stripeBalls.map((number) => (
            <Button
              key={number}
              variant={selectedNumber === (number - 8) ? "default" : "outline"}
              size="sm"
              onClick={() => onNumberChange(number - 8)}
              className="h-10 w-10 p-0 rounded-full"
            >
              {number}
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
          className="h-10 w-10 p-0 rounded-full bg-black text-white border-black"
        >
          8
        </Button>
      </div>
    </div>
  );
};
