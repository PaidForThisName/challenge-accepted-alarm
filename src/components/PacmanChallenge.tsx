
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface PacmanChallengeProps {
  onComplete: () => void;
}

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 15;
const CELL_SIZE = 20;

export const PacmanChallenge = ({ onComplete }: PacmanChallengeProps) => {
  const [pacmanPos, setPacmanPos] = useState<Position>({ x: 1, y: 1 });
  const [dots, setDots] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');

  // Create maze walls (simple pattern)
  const walls = [
    // Outer walls
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: GRID_SIZE - 1, y: i })),
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: i, y: 0 })),
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: i, y: GRID_SIZE - 1 })),
    // Inner walls
    { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
    { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 },
    { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 },
  ];

  // Initialize dots
  useEffect(() => {
    const initialDots: Position[] = [];
    for (let x = 1; x < GRID_SIZE - 1; x++) {
      for (let y = 1; y < GRID_SIZE - 1; y++) {
        if (!walls.some(wall => wall.x === x && wall.y === y) && 
            !(x === 1 && y === 1)) {
          initialDots.push({ x, y });
        }
      }
    }
    setDots(initialDots.slice(0, 10)); // Only 10 dots for quick completion
  }, []);

  const isWall = (x: number, y: number) => {
    return walls.some(wall => wall.x === x && wall.y === y);
  };

  const movePacman = useCallback((newDirection: 'up' | 'down' | 'left' | 'right') => {
    setPacmanPos(prevPos => {
      let newX = prevPos.x;
      let newY = prevPos.y;

      switch (newDirection) {
        case 'up': newY = Math.max(0, prevPos.y - 1); break;
        case 'down': newY = Math.min(GRID_SIZE - 1, prevPos.y + 1); break;
        case 'left': newX = Math.max(0, prevPos.x - 1); break;
        case 'right': newX = Math.min(GRID_SIZE - 1, prevPos.x + 1); break;
      }

      if (!isWall(newX, newY)) {
        setDirection(newDirection);
        return { x: newX, y: newY };
      }
      return prevPos;
    });
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp': movePacman('up'); break;
        case 'ArrowDown': movePacman('down'); break;
        case 'ArrowLeft': movePacman('left'); break;
        case 'ArrowRight': movePacman('right'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePacman]);

  // Check for dot collection
  useEffect(() => {
    setDots(prevDots => {
      const newDots = prevDots.filter(dot => 
        !(dot.x === pacmanPos.x && dot.y === pacmanPos.y)
      );
      
      if (newDots.length < prevDots.length) {
        setScore(prevScore => prevScore + 10);
      }

      if (newDots.length === 0) {
        setIsComplete(true);
        setTimeout(onComplete, 1000);
      }

      return newDots;
    });
  }, [pacmanPos, onComplete]);

  const getPacmanRotation = () => {
    switch (direction) {
      case 'up': return 'rotate(-90deg)';
      case 'down': return 'rotate(90deg)';
      case 'left': return 'rotate(180deg)';
      default: return 'rotate(0deg)';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">Pac-Man Challenge</h3>
        <p className="text-white">Collect all dots to dismiss the alarm!</p>
        <p className="text-lg font-bold text-cyan-400 mt-2">Score: {score}</p>
      </div>

      <div className="flex justify-center">
        <div 
          className="relative border-2 border-blue-400 bg-black rounded-lg p-2"
          style={{ 
            width: GRID_SIZE * CELL_SIZE + 4, 
            height: GRID_SIZE * CELL_SIZE + 4 
          }}
        >
          {/* Render walls */}
          {walls.map((wall, index) => (
            <div
              key={`wall-${index}`}
              className="absolute bg-blue-600"
              style={{
                left: wall.x * CELL_SIZE,
                top: wall.y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            />
          ))}

          {/* Render dots */}
          {dots.map((dot, index) => (
            <div
              key={`dot-${index}`}
              className="absolute bg-yellow-300 rounded-full animate-pulse"
              style={{
                left: dot.x * CELL_SIZE + CELL_SIZE/2 - 2,
                top: dot.y * CELL_SIZE + CELL_SIZE/2 - 2,
                width: 4,
                height: 4,
              }}
            />
          ))}

          {/* Render Pacman */}
          <div
            className="absolute bg-yellow-400 rounded-full transition-all duration-200 flex items-center justify-center"
            style={{
              left: pacmanPos.x * CELL_SIZE + 2,
              top: pacmanPos.y * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              transform: getPacmanRotation(),
            }}
          >
            <div className="w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-2 border-b-black" />
          </div>
        </div>
      </div>

      {/* Control buttons for touch devices */}
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={() => movePacman('up')}
          variant="outline"
          size="sm"
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <div className="flex space-x-2">
          <Button
            onClick={() => movePacman('left')}
            variant="outline"
            size="sm"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => movePacman('right')}
            variant="outline"
            size="sm"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={() => movePacman('down')}
          variant="outline"
          size="sm"
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-center text-sm text-slate-400">
        Use arrow keys or buttons to move
      </p>

      {isComplete && (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto animate-pulse" />
          <p className="text-2xl font-bold text-green-400">Challenge Complete!</p>
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-full"
          >
            Dismiss Alarm
          </Button>
        </div>
      )}
    </div>
  );
};
