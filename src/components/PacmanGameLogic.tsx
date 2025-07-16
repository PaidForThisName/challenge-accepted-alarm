
import { useState, useEffect, useCallback, useMemo } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  id: number;
  position: Position;
  color: string;
  target: Position;
  mode: 'chase' | 'scatter';
}

const GRID_SIZE = 19;

export const usePacmanGame = () => {
  const [pacmanPos, setPacmanPos] = useState<Position>({ x: 9, y: 15 });
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { id: 1, position: { x: 9, y: 7 }, color: 'bg-red-500', target: { x: 9, y: 15 }, mode: 'chase' },
    { id: 2, position: { x: 8, y: 8 }, color: 'bg-pink-500', target: { x: 9, y: 15 }, mode: 'chase' },
    { id: 3, position: { x: 10, y: 8 }, color: 'bg-cyan-500', target: { x: 9, y: 15 }, mode: 'chase' },
    { id: 4, position: { x: 9, y: 8 }, color: 'bg-orange-500', target: { x: 9, y: 15 }, mode: 'chase' },
  ]);
  const [dots, setDots] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [gameInitialized, setGameInitialized] = useState(false);

  // Enhanced maze with more complex layout - memoized to prevent recreating
  const walls = useMemo(() => [
    // Outer walls
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: 0, y: i })),
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: GRID_SIZE - 1, y: i })),
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: i, y: 0 })),
    ...Array.from({ length: GRID_SIZE }, (_, i) => ({ x: i, y: GRID_SIZE - 1 })),
    // Inner maze structure
    { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 }, { x: 13, y: 2 }, { x: 14, y: 2 }, { x: 15, y: 2 }, { x: 16, y: 2 },
    { x: 2, y: 4 }, { x: 4, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 10, y: 4 }, { x: 11, y: 4 }, { x: 12, y: 4 }, { x: 14, y: 4 }, { x: 16, y: 4 },
    { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 6, y: 6 }, { x: 12, y: 6 }, { x: 14, y: 6 }, { x: 15, y: 6 }, { x: 16, y: 6 },
    { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 11, y: 8 }, { x: 12, y: 8 },
    { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 }, { x: 6, y: 10 }, { x: 12, y: 10 }, { x: 14, y: 10 }, { x: 15, y: 10 }, { x: 16, y: 10 },
    { x: 2, y: 12 }, { x: 4, y: 12 }, { x: 6, y: 12 }, { x: 7, y: 12 }, { x: 8, y: 12 }, { x: 10, y: 12 }, { x: 11, y: 12 }, { x: 12, y: 12 }, { x: 14, y: 12 }, { x: 16, y: 12 },
    { x: 2, y: 14 }, { x: 3, y: 14 }, { x: 4, y: 14 }, { x: 5, y: 14 }, { x: 7, y: 14 }, { x: 8, y: 14 }, { x: 9, y: 14 }, { x: 10, y: 14 }, { x: 11, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }, { x: 15, y: 14 }, { x: 16, y: 14 },
    { x: 2, y: 16 }, { x: 4, y: 16 }, { x: 6, y: 16 }, { x: 12, y: 16 }, { x: 14, y: 16 }, { x: 16, y: 16 },
  ], []);

  const isWall = useCallback((x: number, y: number) => {
    return walls.some(wall => wall.x === x && wall.y === y);
  }, [walls]);

  // Initialize dots only once
  useEffect(() => {
    if (!gameInitialized) {
      const initialDots: Position[] = [];
      for (let x = 1; x < GRID_SIZE - 1; x++) {
        for (let y = 1; y < GRID_SIZE - 1; y++) {
          if (!isWall(x, y) && 
              !(x === 9 && y === 15) && // Don't place dot on initial pacman position
              !(x === 9 && y === 7) && !(x === 8 && y === 8) && !(x === 10 && y === 8) && !(x === 9 && y === 8)) { // Don't place dots on ghost positions
            initialDots.push({ x, y });
          }
        }
      }
      setDots(initialDots.slice(0, 30)); // 30 dots for reasonable challenge
      setGameInitialized(true);
    }
  }, [gameInitialized, isWall]);

  // Ghost AI movement
  useEffect(() => {
    if (!gameInitialized) return;
    
    const moveGhosts = () => {
      if (gameOver) return;

      setGhosts(prevGhosts => 
        prevGhosts.map(ghost => {
          const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
          ];

          // Find valid moves
          const validMoves = directions.filter(dir => {
            const newX = ghost.position.x + dir.x;
            const newY = ghost.position.y + dir.y;
            return !isWall(newX, newY);
          });

          if (validMoves.length === 0) return ghost;

          // Simple AI: move towards Pacman
          let bestMove = validMoves[0];
          let bestDistance = Infinity;

          validMoves.forEach(move => {
            const newX = ghost.position.x + move.x;
            const newY = ghost.position.y + move.y;
            const distance = Math.abs(newX - pacmanPos.x) + Math.abs(newY - pacmanPos.y);
            
            if (distance < bestDistance) {
              bestDistance = distance;
              bestMove = move;
            }
          });

          return {
            ...ghost,
            position: {
              x: ghost.position.x + bestMove.x,
              y: ghost.position.y + bestMove.y
            }
          };
        })
      );
    };

    const ghostTimer = setInterval(moveGhosts, 400); // Slightly slower ghosts
    return () => clearInterval(ghostTimer);
  }, [pacmanPos, gameOver, isWall, gameInitialized]);

  // Check collision with ghosts
  useEffect(() => {
    if (!gameInitialized) return;
    
    const collision = ghosts.some(ghost => 
      ghost.position.x === pacmanPos.x && ghost.position.y === pacmanPos.y
    );
    
    if (collision) {
      setGameOver(true);
    }
  }, [pacmanPos, ghosts, gameInitialized]);

  const movePacman = useCallback((newDirection: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || !gameInitialized) return;

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
  }, [gameOver, isWall, gameInitialized]);

  // Check for dot collection
  useEffect(() => {
    if (!gameInitialized) return;
    
    setDots(prevDots => {
      const newDots = prevDots.filter(dot => 
        !(dot.x === pacmanPos.x && dot.y === pacmanPos.y)
      );
      
      if (newDots.length < prevDots.length) {
        setScore(prevScore => prevScore + 10);
      }

      return newDots;
    });
  }, [pacmanPos, gameInitialized]);

  const getPacmanRotation = () => {
    switch (direction) {
      case 'up': return 'rotate(-90deg)';
      case 'down': return 'rotate(90deg)';
      case 'left': return 'rotate(180deg)';
      default: return 'rotate(0deg)';
    }
  };

  const resetGame = useCallback(() => {
    setPacmanPos({ x: 9, y: 15 });
    setGhosts([
      { id: 1, position: { x: 9, y: 7 }, color: 'bg-red-500', target: { x: 9, y: 15 }, mode: 'chase' },
      { id: 2, position: { x: 8, y: 8 }, color: 'bg-pink-500',target: { x: 9, y: 15 }, mode: 'chase' },
      { id: 3, position: { x: 10, y: 8 }, color: 'bg-cyan-500', target: { x: 9, y: 15 }, mode: 'chase' },
      { id: 4, position: { x: 9, y: 8 }, color: 'bg-orange-500', target: { x: 9, y: 15 }, mode: 'chase' },
    ]);
    setScore(0);
    setGameOver(false);
    setDirection('right');
    setGameInitialized(false); // This will trigger dots reinitialization
  }, []);

  return {
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
    isComplete: dots.length === 0 && !gameOver && gameInitialized,
    GRID_SIZE
  };
};
