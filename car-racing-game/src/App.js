import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import carImage from './images/car.png'; 

const CAR_WIDTH = 50;
const CAR_HEIGHT = 70;
const TRACK_WIDTH = 400;
const TRACK_HEIGHT = 600;
const OBSTACLE_SPEED = 5;
const PLAYER_MOVE_DISTANCE = 10;

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: TRACK_WIDTH / 2 - CAR_WIDTH / 2, y: TRACK_HEIGHT - CAR_HEIGHT });
  const [obstaclePosition, setObstaclePosition] = useState({ x: Math.random() * (TRACK_WIDTH - CAR_WIDTH), y: 0 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    intervalRef.current = setInterval(() => {
      if (!isGameOver) {
        moveObstacle();
        checkCollision();
      }
    }, 10);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, [playerPosition, obstaclePosition, isGameOver]);

  const handleKeyDown = (e) => {
    if (isGameOver) return;

    const { x } = playerPosition;

    if (e.key === 'ArrowLeft' && x > 0) {
      setPlayerPosition((prev) => ({ ...prev, x: x - PLAYER_MOVE_DISTANCE }));
    }
    if (e.key === 'ArrowRight' && x < TRACK_WIDTH - CAR_WIDTH) {
      setPlayerPosition((prev) => ({ ...prev, x: x + PLAYER_MOVE_DISTANCE }));
    }
  };

  const moveObstacle = () => {
    setObstaclePosition(prev => {
      const newY = prev.y + OBSTACLE_SPEED;
      if (newY > TRACK_HEIGHT) {
        setScore(prevScore => prevScore + 1);
        return { x: Math.random() * (TRACK_WIDTH - CAR_WIDTH), y: 0 };
      }
      return { ...prev, y: newY };
    });
  };

  const checkCollision = () => {
    const px1 = playerPosition.x;
    const px2 = playerPosition.x + CAR_WIDTH;
    const py1 = playerPosition.y;
    const py2 = playerPosition.y + CAR_HEIGHT;

    const ox1 = obstaclePosition.x;
    const ox2 = obstaclePosition.x + CAR_WIDTH;
    const oy1 = obstaclePosition.y;
    const oy2 = obstaclePosition.y + CAR_HEIGHT;

    if (!(px2 < ox1 || px1 > ox2 || py2 < oy1 || py1 > oy2)) {
      setIsGameOver(true);
      clearInterval(intervalRef.current);
    }
  };

  const restartGame = () => {
    setPlayerPosition({ x: TRACK_WIDTH / 2 - CAR_WIDTH / 2, y: TRACK_HEIGHT - CAR_HEIGHT });
    setObstaclePosition({ x: Math.random() * (TRACK_WIDTH - CAR_WIDTH), y: 0 });
    setScore(0);
    setIsGameOver(false);
    intervalRef.current = setInterval(() => {
      if (!isGameOver) {
        moveObstacle();
        checkCollision();
      }
    }, 30);
  };

  return (
    <div className="game-container">
      <div className="track">
        <div
          className="car player-car"
          style={{ left: playerPosition.x, top: playerPosition.y }}
        ></div>
        <div
          className="car enemy-car"
          style={{ left: obstaclePosition.x, top: obstaclePosition.y }}
        ></div>
        {isGameOver && (
          <div className="game-over">
            <p>Game Over!</p>
            <button onClick={restartGame}>Restart</button>
          </div>
        )}
        <div className="score">Score: {score}</div>
      </div>
    </div>
  );
}

export default App;
