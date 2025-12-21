# 🧟 Zombie Shooter

A grid-based **zombie shooter game** built using **React** and basic game-loop logic.  
The player navigates a walled arena, shoots incoming zombies, collects coins, and survives as long as possible.

---

## 🎮 Gameplay Overview

- The game takes place on a **40×40 grid**
- Player moves one cell at a time
- Zombies spawn continuously and attempt to reach the player
- Shooting is directional based on player facing
- The game ends when a zombie reaches the player

---

## 🕹 Controls

- **Move**: `W`, `A`, `S`, `D`
- **Shoot**: Left Mouse Click
- **Start Game**: Click `START GAME`
- **Restart**: Click `Play Again`
- **Exit to Title**: Click `Exit to Title`

---

## ✨ Features

### 🔹 Player System
- Grid-based movement with collision detection
- Directional facing (up, down, left, right)
- Visual direction indicator using arrows
- Cannot pass through walls or boundaries

---

### 🔹 Shooting System
- Bullets fire in the player’s facing direction
- Bullets move cell-by-cell
- Bullets are removed when:
  - They hit a wall
  - They leave the grid
  - They hit a zombie
- Multiple bullets can exist at once

---

### 🔹 Zombie AI System
- Zombies spawn at random valid positions
- Maximum zombie cap at 50 to prevent overload
- Zombies avoid walls and overlapping each other

#### Zombie Types
|  Type  |  Color | Health |      Behavior      |
|--------|--------|--------|--------------------|
| Type 1 | Red    | 1      | Fast, weak         |
| Type 2 | Orange | 3      | Tanky              |
| Type 3 | Purple | 5      | Spawns new zombies |

#### Zombie Behavior
- **Chase Mode**:  
  Zombies move toward the player when within a detection range of 4 tiles
- **Wander Mode**:  
  Zombies move randomly when far from the player
- **Spawner Zombies (Type 3)**:
  - Periodically spawn Type 1 zombies around them
  - Respect max zombie limit

---

### 🔹 Wall System
- Randomly generated walls at game start
- Walls block:
  - Player movement
  - Zombie movement
  - Bullet travel
- Guaranteed safe spawn zone around the player (2 tiles)

---

### 🔹 Coin & Score System
- Coins spawn randomly on the map
- Coins cannot spawn inside walls or on zombies
- Collecting coins increases score
- Killing zombies also increases score (based on zombie type)

---

### 🔹 Game State Management
- **Title Screen**
  - Displays controls and start button
- **In-Game State**
  - Real-time movement, shooting, AI, scoring
- **Game Over Screen**
  - Triggered when a zombie reaches the player
  - Displays final score
  - Options to restart or exit

---

### 🔹 Performance & Logic
- Time-based game loop (not frame-dependent)
- Separate update rates for:
  - Player movement
  - Zombie chasing
  - Zombie wandering
  - Spawning systems
- Uses React hooks:
  - `useState`
  - `useEffect`
  - `useRef`

---

## 🛠 Tech Stack

- **React (Vite)**
- JavaScript (ES6+)
- Inline CSS styling
- No external game engine

---

## 🚀 Possible Enhancements
- Player health instead of instant death
- Sound effects & background music
- Power-ups and weapons
- Smarter zombie pathfinding (A*)
- Mobile/touch controls
- Leaderboard system
- Level-based progression

---

## 📌 How to Run

```bash
npm install
npm run dev
