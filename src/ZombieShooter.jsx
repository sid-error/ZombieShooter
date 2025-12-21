import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 30;
const CELL_SIZE = 20;
const PLAYER_SPEED = 50;
const ZOMBIE_SPEED = 400;
const ZOMBIE_WANDER_SPEED = 1200;
const BULLET_SPEED = 100;
const ZOMBIE_SPAWN_RATE = 2500;
const COIN_SPAWN_RATE = 3000;
const TYPE3_SPAWN_INTERVAL = 8000;
const MAX_ZOMBIES = 50;

const ZombieShooter = () => {
  const [player, setPlayer] = useState({ x: 20, y: 20, dir: 'up' });
  const [zombies, setZombies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [coins, setCoins] = useState([]);
  const [walls, setWalls] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const keysPressed = useRef({});
  const lastMoveTime = useRef(0);
  const lastZombieMove = useRef(0);
  const lastZombieWander = useRef(0);
  const lastZombieSpawn = useRef(0);
  const lastCoinSpawn = useRef(0);
  const type3SpawnTimers = useRef({});
  const zombieIdCounter = useRef(0);

  const getRandomPos = (checkPlayer = true) => {
    let pos;
    let attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      attempts++;
      const distanceToPlayer = checkPlayer ? Math.abs(pos.x - player.x) + Math.abs(pos.y - player.y) : 999;
      const hasZombie = zombies.some(z => z.x === pos.x && z.y === pos.y);
      const hasCoin = coins.some(c => c.x === pos.x && c.y === pos.y);
      
      if (!isWall(pos.x, pos.y) && !hasZombie && !hasCoin && distanceToPlayer > 4) {
        break;
      }
    } while (attempts < 50);
    
    return pos;
  };

  const isWall = (x, y) => {
    return walls.some(w => w.x === x && w.y === y);
  };

  const generateWalls = () => {
    const newWalls = [];
    const numWalls = Math.floor(GRID_SIZE * GRID_SIZE * 0.15);
    
    for (let i = 0; i < numWalls; i++) {
      let pos;
      let attempts = 0;
      do {
        pos = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
        attempts++;
      } while (
        attempts < 100 && 
        (newWalls.some(w => w.x === pos.x && w.y === pos.y) ||
        (pos.x === 20 && pos.y === 20) ||
        (Math.abs(pos.x - 20) <= 2 && Math.abs(pos.y - 20) <= 2))
      );
      
      if (attempts < 100) {
        newWalls.push({ ...pos, id: i });
      }
    }
    
    return newWalls;
  };

  const spawnZombie = () => {
    const rand = Math.random();
    let type;
    if (rand < 0.7) type = 1;
    else if (rand < 0.95) type = 2;
    else type = 3;

    const pos = getRandomPos();
    const id = zombieIdCounter.current++;
    
    return {
      ...pos,
      type,
      health: type === 1 ? 1 : type === 2 ? 3 : 5,
      id
    };
  };

  const spawnType1Zombies = (x, y) => {
    const directions = [
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x - 1, y: y },
      { x: x + 1, y: y }
    ];

    return directions
      .filter(pos => {
        if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE) {
          return false;
        }
        if (isWall(pos.x, pos.y)) {
          return false;
        }
        const hasZombie = zombies.some(z => z.x === pos.x && z.y === pos.y);
        if (hasZombie) {
          return false;
        }
        return true;
      })
      .map(pos => ({
        ...pos,
        type: 1,
        health: 1,
        id: zombieIdCounter.current++
      }));
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        keysPressed.current[key] = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keysPressed.current[key] = false;
      }
    };

    const handleClick = (e) => {
      e.preventDefault();
      const dirMap = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      };
      
      const dir = dirMap[player.dir];
      setBullets(prev => [...prev, {
        x: player.x,
        y: player.y,
        dx: dir.x,
        dy: dir.y,
        id: Date.now() + Math.random()
      }]);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('click', handleClick);
    };
  }, [gameStarted, gameOver, player]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      const now = Date.now();

      if (now - lastMoveTime.current > PLAYER_SPEED) {
        setPlayer(prev => {
          let newX = prev.x;
          let newY = prev.y;
          let newDir = prev.dir;
          let moved = false;

          if (keysPressed.current['w'] && !moved) {
            const targetY = Math.max(0, prev.y - 1);
            if (targetY !== prev.y && !walls.some(w => w.x === prev.x && w.y === targetY)) {
              newY = targetY;
              moved = true;
            }
            newDir = 'up';
          }
          if (keysPressed.current['s'] && !moved) {
            const targetY = Math.min(GRID_SIZE - 1, prev.y + 1);
            if (targetY !== prev.y && !walls.some(w => w.x === prev.x && w.y === targetY)) {
              newY = targetY;
              moved = true;
            }
            newDir = 'down';
          }
          if (keysPressed.current['a'] && !moved) {
            const targetX = Math.max(0, prev.x - 1);
            if (targetX !== prev.x && !walls.some(w => w.x === targetX && w.y === prev.y)) {
              newX = targetX;
              moved = true;
            }
            newDir = 'left';
          }
          if (keysPressed.current['d'] && !moved) {
            const targetX = Math.min(GRID_SIZE - 1, prev.x + 1);
            if (targetX !== prev.x && !walls.some(w => w.x === targetX && w.y === prev.y)) {
              newX = targetX;
              moved = true;
            }
            newDir = 'right';
          }

          if (keysPressed.current['w']) newDir = 'up';
          else if (keysPressed.current['s']) newDir = 'down';
          else if (keysPressed.current['a']) newDir = 'left';
          else if (keysPressed.current['d']) newDir = 'right';

          return { x: newX, y: newY, dir: newDir };
        });
        lastMoveTime.current = now;
      }

      if (now - lastZombieSpawn.current > ZOMBIE_SPAWN_RATE) {
        setZombies(prev => {
          if (prev.length >= MAX_ZOMBIES) {
            return prev;
          }
          return [...prev, spawnZombie()];
        });
        lastZombieSpawn.current = now;
      }

      if (now - lastCoinSpawn.current > COIN_SPAWN_RATE) {
        const newPos = getRandomPos();
        setCoins(prev => [...prev, { ...newPos, id: Date.now() }]);
        lastCoinSpawn.current = now;
      }

      if (now - lastZombieMove.current > ZOMBIE_SPEED) {
        setPlayer(p => {
          setZombies(prev => prev.map(z => {
            const dx = p.x - z.x;
            const dy = p.y - z.y;
            const distance = Math.abs(dx) + Math.abs(dy);
            
            let newX = z.x;
            let newY = z.y;

            if (distance <= 4) {
              if (Math.abs(dx) > Math.abs(dy)) {
                const targetX = z.x + Math.sign(dx);
                if (!walls.some(w => w.x === targetX && w.y === z.y) && !prev.some(other => other.id !== z.id && other.x === targetX && other.y === z.y)) {
                  newX = targetX;
                }
              } else {
                const targetY = z.y + Math.sign(dy);
                if (!walls.some(w => w.x === z.x && w.y === targetY) && !prev.some(other => other.id !== z.id && other.x === z.x && other.y === targetY)) {
                  newY = targetY;
                }
              }
            }

            return { ...z, x: newX, y: newY };
          }));
          return p;
        });
        lastZombieMove.current = now;
      }

      if (now - lastZombieWander.current > ZOMBIE_WANDER_SPEED) {
        setPlayer(p => {
          setZombies(prev => prev.map(z => {
            const dx = p.x - z.x;
            const dy = p.y - z.y;
            const distance = Math.abs(dx) + Math.abs(dy);
            
            let newX = z.x;
            let newY = z.y;

            if (distance > 4) {
              const randomDirection = Math.floor(Math.random() * 4);
              let targetX = z.x;
              let targetY = z.y;
              
              if (randomDirection === 0) targetY = z.y - 1;
              else if (randomDirection === 1) targetY = z.y + 1;
              else if (randomDirection === 2) targetX = z.x - 1;
              else targetX = z.x + 1;
              
              if (targetX >= 0 && targetX < GRID_SIZE && 
                  targetY >= 0 && targetY < GRID_SIZE && 
                  !walls.some(w => w.x === targetX && w.y === targetY) &&
                  !prev.some(other => other.id !== z.id && other.x === targetX && other.y === targetY)) {
                newX = targetX;
                newY = targetY;
              }
            }

            return { ...z, x: newX, y: newY };
          }));
          return p;
        });
        lastZombieWander.current = now;
      }

      setBullets(prev => prev
        .map(b => ({ ...b, x: b.x + b.dx, y: b.y + b.dy }))
        .filter(b => 
          b.x >= 0 && b.x < GRID_SIZE && 
          b.y >= 0 && b.y < GRID_SIZE &&
          !walls.some(w => w.x === b.x && w.y === b.y)
        )
      );

      setZombies(prev => {
        if (prev.length >= MAX_ZOMBIES) {
          return prev;
        }
        
        const newZombies = [...prev];
        const additionalZombies = [];

        prev.forEach(z => {
          if (z.type === 3 && newZombies.length + additionalZombies.length < MAX_ZOMBIES) {
            if (!type3SpawnTimers.current[z.id]) {
              type3SpawnTimers.current[z.id] = now;
            } else if (now - type3SpawnTimers.current[z.id] > TYPE3_SPAWN_INTERVAL) {
              const spawned = spawnType1Zombies(z.x, z.y);
              if (spawned.length > 0) {
                const remainingSlots = MAX_ZOMBIES - (newZombies.length + additionalZombies.length);
                const zombiesToAdd = spawned.slice(0, remainingSlots);
                additionalZombies.push(...zombiesToAdd);
                type3SpawnTimers.current[z.id] = now;
              }
            }
          }
        });

        return [...newZombies, ...additionalZombies];
      });

    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, walls]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const zombieHit = zombies.some(z => z.x === player.x && z.y === player.y);
    if (zombieHit) {
      setGameOver(true);
      return;
    }

    setBullets(prevBullets => {
      const remainingBullets = [...prevBullets];
      
      setZombies(prevZombies => {
        let updatedZombies = [...prevZombies];

        prevBullets.forEach(bullet => {
          const hitZombieIndex = updatedZombies.findIndex(
            z => z.x === bullet.x && z.y === bullet.y
          );

          if (hitZombieIndex !== -1) {
            const bulletIndex = remainingBullets.findIndex(b => b.id === bullet.id);
            if (bulletIndex !== -1) {
              remainingBullets.splice(bulletIndex, 1);
            }

            updatedZombies[hitZombieIndex] = {
              ...updatedZombies[hitZombieIndex],
              health: updatedZombies[hitZombieIndex].health - 1
            };

            if (updatedZombies[hitZombieIndex].health <= 0) {
              const killedZombie = updatedZombies[hitZombieIndex];
              setScore(s => s + killedZombie.type);
              delete type3SpawnTimers.current[killedZombie.id];
              updatedZombies.splice(hitZombieIndex, 1);
            }
          }
        });

        return updatedZombies;
      });

      return remainingBullets;
    });

    setCoins(prevCoins => {
      const collected = prevCoins.filter(c => c.x === player.x && c.y === player.y);
      if (collected.length > 0) {
        setScore(s => s + collected.length);
      }
      return prevCoins.filter(c => c.x !== player.x || c.y !== player.y);
    });

  }, [zombies, bullets, coins, player, gameStarted, gameOver]);

  const startGame = () => {
    const newWalls = generateWalls();
    setWalls(newWalls);
    setGameStarted(true);
    setGameOver(false);
    setPlayer({ x: 20, y: 20, dir: 'up' });
    setZombies([]);
    setBullets([]);
    setCoins([]);
    setScore(0);
    type3SpawnTimers.current = {};
    zombieIdCounter.current = 0;
    keysPressed.current = {};
    lastMoveTime.current = 0;
    lastZombieMove.current = 0;
    lastZombieWander.current = 0;
    lastZombieSpawn.current = 0;
    lastCoinSpawn.current = 0;
  };

  const exitToTitle = () => {
    setGameStarted(false);
    setGameOver(false);
    setPlayer({ x: 20, y: 20, dir: 'up' });
    setZombies([]);
    setBullets([]);
    setCoins([]);
    setWalls([]);
    setScore(0);
    type3SpawnTimers.current = {};
    zombieIdCounter.current = 0;
    keysPressed.current = {};
    lastMoveTime.current = 0;
    lastZombieMove.current = 0;
    lastZombieWander.current = 0;
    lastZombieSpawn.current = 0;
    lastCoinSpawn.current = 0;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-4xl">
        <div className="text-white text-2xl font-bold">
          Score: {score}
        </div>
        {gameStarted && !gameOver && (
          <button
            onClick={exitToTitle}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-bold"
          >
            Exit to Title
          </button>
        )}
      </div>
      
      <div 
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          position: 'relative',
          border: '4px solid #444',
          backgroundColor: '#222'
        }}
      >
        {/* Walls */}
        {walls.map(w => (
          <div
            key={w.id}
            style={{
              position: 'absolute',
              left: w.x * CELL_SIZE,
              top: w.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: '#555',
              border: '1px solid #333'
            }}
          />
        ))}

        {/* Player */}
        <div
          style={{
            position: 'absolute',
            left: player.x * CELL_SIZE,
            top: player.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: '#4CAF50',
            border: '2px solid #2E7D32',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}
        >
          {player.dir === 'up' && '↑'}
          {player.dir === 'down' && '↓'}
          {player.dir === 'left' && '←'}
          {player.dir === 'right' && '→'}
        </div>

        {/* Zombies */}
        {zombies.map(z => (
          <div
            key={z.id}
            style={{
              position: 'absolute',
              left: z.x * CELL_SIZE,
              top: z.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: z.type === 1 ? '#FF5252' : z.type === 2 ? '#FF9800' : '#9C27B0',
              border: '2px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {z.health}
          </div>
        ))}

        {/* Bullets */}
        {bullets.map(b => (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: b.x * CELL_SIZE + CELL_SIZE / 4,
              top: b.y * CELL_SIZE + CELL_SIZE / 4,
              width: CELL_SIZE / 2,
              height: CELL_SIZE / 2,
              backgroundColor: '#FFFFFF',
              borderRadius: '50%',
              border: '1px solid #CCCCCC'
            }}
          />
        ))}

        {/* Coins */}
        {coins.map(c => (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              left: c.x * CELL_SIZE + CELL_SIZE / 4,
              top: c.y * CELL_SIZE + CELL_SIZE / 4,
              width: CELL_SIZE / 2,
              height: CELL_SIZE / 2,
              backgroundColor: '#FFD700',
              borderRadius: '50%',
              border: '2px solid #FFA000'
            }}
          />
        ))}

        {/* Game Over Overlay */}
        {gameOver && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <h2 className="text-4xl font-bold mb-4">GAME OVER</h2>
            <p className="text-2xl mb-6">Final Score: {score}</p>
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded text-xl font-bold"
              >
                Play Again
              </button>
              <button
                onClick={exitToTitle}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded text-xl font-bold"
              >
                Exit to Title
              </button>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameStarted && !gameOver && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              padding: '20px'
            }}
          >
            <h1 className="text-4xl font-bold mb-6">ZOMBIE SHOOTER</h1>
            <div className="text-left mb-6 space-y-2">
              <p>• Move: WASD</p>
              <p>• Shoot: Left Click</p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded text-2xl font-bold"
            >
              START GAME
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-400 text-sm">
        Move: WASD | Shoot: Left Click
      </div>
    </div>
  );
};

export default ZombieShooter;