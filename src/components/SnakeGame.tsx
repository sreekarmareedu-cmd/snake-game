import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

export const SnakeGame: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const hitSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!hitSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };
        setDirection(nextDirection);

        switch (nextDirection) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 50) * SPEED_INCREMENT);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [food, gameOver, isPaused, nextDirection, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? accentColor : '#ffffff';
      ctx.shadowBlur = index === 0 ? 10 : 0;
      ctx.shadowColor = accentColor;
      
      const x = segment.x * cellSize + 1;
      const y = segment.y * cellSize + 1;
      const size = cellSize - 2;
      
      ctx.fillRect(x, y, size, size);
      
      // Glitch effect on head
      if (index === 0 && Math.random() > 0.9) {
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(x - 5, y, 2, size);
      }
    });

    // Draw food
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 4,
      food.y * cellSize + 4,
      cellSize - 8,
      cellSize - 8
    );

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food, accentColor]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 flex w-full justify-between px-2 font-mono tracking-[0.2em] text-[#00ffff] uppercase">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] opacity-50">S_DATA_EXTRACTED</span>
          <span className="text-3xl font-black tabular-nums">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
           <span className="text-[10px] opacity-50">NODE_RECORD</span>
           <span className="text-xl font-bold opacity-80">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-4 border-[#00ffff] shadow-[0_0_20px_#00ffff44]">
        <div className="scanline" />
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/criss-cross.png')]" />
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="h-[300px] w-[300px] cursor-none md:h-[400px] md:w-[400px]"
        />

        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#000] border-4 border-[#ff00ff]"
            >
              <div className="relative flex flex-col items-center p-8 text-center">
                <h2 
                  className="animate-glitch font-pixel text-2xl tracking-tighter text-[#ff00ff] uppercase"
                  data-text="SYS_CORRUPT"
                >
                  SYS_CORRUPT
                </h2>
                
                <div className="mt-8 font-mono text-sm leading-relaxed text-[#00ffff]">
                  ERROR_CODE: 0x429<br/>
                  MEMORY_DUMP: {score.toString(16).toUpperCase()}<br/>
                  PROCESS_TERMINATED
                </div>

                <button
                  onClick={resetGame}
                  className="mt-12 border-2 border-[#00ffff] bg-transparent px-8 py-4 font-pixel text-[10px] text-[#00ffff] transition-all hover:bg-[#00ffff] hover:text-black active:translate-y-1"
                >
                  RELOAD_KERNEL
                </button>
              </div>
            </motion.div>
          )}

          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <div className="text-2xl font-bold tracking-widest text-white uppercase italic">
                Paused
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-[10px] tracking-[0.2em] text-white/30 uppercase">
        Use Arrows to move • Space to pause
      </div>
    </div>
  );
};
