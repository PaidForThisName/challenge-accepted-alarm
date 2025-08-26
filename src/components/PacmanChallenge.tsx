
import React, { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { PacmanGhost } from './PacmanGhost';
import { usePacmanGame } from './PacmanGameLogic';

interface PacmanChallengeProps {
  onComplete: () => void;
}

const CELL_SIZE = 24;

export const PacmanChallenge = ({ onComplete }: PacmanChallengeProps) => {
  const {
    pacmanPos,
    ghosts,
    dots,
    score,
    gameOver,
    direction,
    walls,
    movePacman,
    getPacmanRotation,
    resetGame,
    isComplete,
    GRID_SIZE
  } = usePacmanGame();

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isComplete) return; // freeze controls on win
      event.preventDefault();
      switch (event.key) {
        case 'ArrowUp': movePacman('up'); break;
        case 'ArrowDown': movePacman('down'); break;
        case 'ArrowLeft': movePacman('left'); break;
        case 'ArrowRight': movePacman('right'); break;
        case 'r':
        case 'R': 
          if (gameOver) resetGame(); 
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePacman, gameOver, resetGame, isComplete]);

  // Auto-dismiss a moment after completion (also stops alarm)
  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(onComplete, 1200);
    return () => clearTimeout(t);
  }, [isComplete, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-yellow-400 mb-2">Enhanced Pac-Man Challenge</h3>
          <p className="text-white mb-2">Avoid the ghosts and collect all dots to dismiss the alarm!</p>
          <div className="flex justify-center items-center space-x-6 text-lg">
            <p className="font-bold text-cyan-400">Score: {score}</p>
            <p className="font-bold text-yellow-400">Dots Left: {dots.length}</p>
          </div>
          {gameOver && (
            <div className="mt-4 space-y-2">
              <p className="text-2xl font-bold text-red-400 animate-pulse">GAME OVER!</p>
              <p className="text-white">Press R or click Reset to try again</p>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-6">
          <div 
            className="relative border-2 border-blue-400 bg-black rounded-lg p-2 shadow-2xl"
            style={{ 
              width: GRID_SIZE * CELL_SIZE + 4, 
              height: GRID_SIZE * CELL_SIZE + 4 
            }}
          >
            {/* Render walls */}
            {walls.map((wall, index) => (
              <div
                key={`wall-${index}`}
                className="absolute bg-blue-600 border border-blue-500"
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
                  left: dot.x * CELL_SIZE + CELL_SIZE/2 - 3,
                  top: dot.y * CELL_SIZE + CELL_SIZE/2 - 3,
                  width: 6,
                  height: 6,
                }}
              />
            ))}

            {/* Render ghosts */}
            {ghosts.map((ghost) => (
              <PacmanGhost
                key={ghost.id}
                position={ghost.position}
                color={ghost.color}
                cellSize={CELL_SIZE}
              />
            ))}

            {/* Render Pacman */}
            <div
              className="absolute bg-yellow-400 rounded-full transition-all duration-150 flex items-center justify-center border-2 border-yellow-500"
              style={{
                left: pacmanPos.x * CELL_SIZE + 2,
                top: pacmanPos.y * CELL_SIZE + 2,
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4,
                transform: getPacmanRotation(),
              }}
            >
              <div className="w-0 h-0 border-l-3 border-l-transparent border-r-3 border-r-transparent border-b-3 border-b-black" />
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex flex-col items-center space-y-3">
          <Button
            onClick={() => movePacman('up')}
            variant="outline"
            size="sm"
            disabled={gameOver || isComplete}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 disabled:opacity-50"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
          <div className="flex space-x-3">
            <Button
              onClick={() => movePacman('left')}
              variant="outline"
              size="sm"
              disabled={gameOver || isComplete}
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {gameOver && (
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="border-green-400 text-green-400 hover:bg-green-400/20"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
            <Button
              onClick={() => movePacman('right')}
              variant="outline"
              size="sm"
              disabled={gameOver || isComplete}
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 disabled:opacity-50"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <Button
            onClick={() => movePacman('down')}
            variant="outline"
            size="sm"
            disabled={gameOver || isComplete}
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 disabled:opacity-50"
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          Use arrow keys or buttons to move • Press R to reset after game over
        </p>

        {isComplete && (
          <div className="text-center space-y-4 mt-6">
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto animate-bounce" />
            <p className="text-3xl font-bold text-green-400">Challenge Complete!</p>
            <p className="text-white">Final Score: {score}</p>
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg"
            >
              Dismiss Alarm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
