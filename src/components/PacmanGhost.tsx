
import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface PacmanGhostProps {
  position: Position;
  color: string;
  cellSize: number;
}

export const PacmanGhost = ({ position, color, cellSize }: PacmanGhostProps) => {
  return (
    <div
      className={`absolute transition-all duration-200 flex items-center justify-center ${color}`}
      style={{
        left: position.x * cellSize + 2,
        top: position.y * cellSize + 2,
        width: cellSize - 4,
        height: cellSize - 4,
      }}
    >
      <div className="w-full h-full rounded-t-full relative overflow-hidden">
        <div className="absolute bottom-0 w-full h-2 flex">
          <div className="flex-1 bg-current"></div>
          <div className="w-1 bg-black"></div>
          <div className="flex-1 bg-current"></div>
          <div className="w-1 bg-black"></div>
          <div className="flex-1 bg-current"></div>
        </div>
        {/* Eyes */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-black rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-black rounded-full"></div>
      </div>
    </div>
  );
};
