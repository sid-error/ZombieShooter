<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> 23192b412f5eaf66b4cfad06b083601b0e31a5a1
